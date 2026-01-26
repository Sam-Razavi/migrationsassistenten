from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.case import Case
from app.services.ai_service import generate_appeal
from app.services.prompt_builder import build_system_prompt, build_user_prompt

router = APIRouter(prefix="/generate", tags=["generate"])


@router.post("/{case_id}")
async def generate_document(case_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Case).where(Case.id == case_id))
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    system_prompt = build_system_prompt()
    user_prompt = build_user_prompt(case)

    full_text = []
    async for chunk in generate_appeal(system_prompt, user_prompt):
        full_text.append(chunk)

    document = "".join(full_text)

    result2 = await db.execute(select(Case).where(Case.id == case_id))
    case_obj = result2.scalar_one_or_none()
    if case_obj:
        case_obj.generated_document = document
        await db.commit()

    return {"document": document}
