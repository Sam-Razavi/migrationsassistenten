from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.database import get_db
from app.models.case import Case
from app.schemas.case import CaseCreate, CaseUpdate, CaseResponse

router = APIRouter(prefix="/cases", tags=["cases"])


@router.post("/", response_model=CaseResponse)
async def create_case(case_data: CaseCreate, db: AsyncSession = Depends(get_db)):
    case = Case(**case_data.model_dump())
    db.add(case)
    await db.commit()
    await db.refresh(case)
    return case


@router.get("/", response_model=List[CaseResponse])
async def list_cases(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Case).order_by(Case.created_at.desc()))
    return result.scalars().all()


@router.get("/{case_id}", response_model=CaseResponse)
async def get_case(case_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Case).where(Case.id == case_id))
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case


@router.put("/{case_id}", response_model=CaseResponse)
async def update_case(case_id: int, case_data: CaseUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Case).where(Case.id == case_id))
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    update_data = case_data.model_dump(exclude_none=True)
    for field, value in update_data.items():
        if field in ("evidence", "timeline") and value is not None:
            value = [
                item.model_dump() if hasattr(item, "model_dump") else item
                for item in value
            ]
        setattr(case, field, value)
    await db.commit()
    await db.refresh(case)
    return case
