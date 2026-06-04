from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db, AsyncSessionLocal
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

    async def stream_generator():
        collected: list[str] = []
        try:
            async for chunk in generate_appeal(system_prompt, user_prompt):
                collected.append(chunk)
                safe = chunk.replace("\n", "\\n")
                yield f"data: {safe}\n\n"
        except Exception as exc:
            yield f"data: [ERROR] {exc}\n\n"
            return

        full_text = "".join(collected)
        async with AsyncSessionLocal() as session:
            res = await session.execute(select(Case).where(Case.id == case_id))
            case_obj = res.scalar_one_or_none()
            if case_obj:
                case_obj.generated_document = full_text
                await session.commit()

        yield "data: [DONE]\n\n"

    return StreamingResponse(
        stream_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
