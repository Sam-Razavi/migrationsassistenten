from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.case import Case
from app.models.user import User
from app.services.pdf_service import generate_pdf
from app.services.auth_service import get_current_user, oauth2_scheme

router = APIRouter(prefix="/export", tags=["export"])


async def _require_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    return await get_current_user(token=token, db=db)


@router.get("/{case_id}")
async def export_pdf(
    case_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(_require_user),
):
    result = await db.execute(
        select(Case).where(Case.id == case_id, Case.user_id == current_user.id)
    )
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
