from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.case import Case
from app.services.pdf_service import generate_pdf

router = APIRouter(prefix="/export", tags=["export"])


@router.get("/{case_id}")
async def export_pdf(case_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Case).where(Case.id == case_id))
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    if not case.generated_document:
        raise HTTPException(
            status_code=400,
            detail="Inget genererat överklagande hittades. Generera dokumentet först.",
        )

    pdf_bytes = generate_pdf(case, case.generated_document)

    safe_name = case.applicant_name.replace(" ", "_")
    safe_num = case.case_number.replace("/", "-").replace(" ", "_")
    filename = f"overklagande_{safe_num}_{safe_name}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
