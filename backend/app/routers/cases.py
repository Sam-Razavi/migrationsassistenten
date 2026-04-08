from datetime import date, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.database import get_db
from app.models.case import Case
from app.models.document_version import DocumentVersion
from app.models.user import User
from app.schemas.case import CaseCreate, CaseUpdate, CaseResponse
from app.schemas.document_version import DocumentVersionResponse, DocumentVersionDetail
from app.services.auth_service import get_current_user, oauth2_scheme


def _compute_deadline(rejection_date_str: str) -> str:
    d = date.fromisoformat(rejection_date_str)
    return (d + timedelta(days=21)).isoformat()

router = APIRouter(prefix="/cases", tags=["cases"])


async def _require_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    return await get_current_user(token=token, db=db)


@router.post("/", response_model=CaseResponse)
async def create_case(
    case_data: CaseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(_require_user),
):
    case = Case(
        **case_data.model_dump(),
        user_id=current_user.id,
        appeal_deadline=_compute_deadline(case_data.rejection_date),
    )
    db.add(case)
    await db.commit()
    await db.refresh(case)
    return case


@router.get("/", response_model=List[CaseResponse])
async def list_cases(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(_require_user),
):
    result = await db.execute(
        select(Case).where(Case.user_id == current_user.id).order_by(Case.created_at.desc())
    )
    return result.scalars().all()


@router.get("/{case_id}", response_model=CaseResponse)
async def get_case(
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
    return case


@router.put("/{case_id}", response_model=CaseResponse)
async def update_case(
    case_id: int,
    case_data: CaseUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(_require_user),
):
    result = await db.execute(
        select(Case).where(Case.id == case_id, Case.user_id == current_user.id)
    )
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    update_data = case_data.model_dump(exclude_none=True)
    for field, value in update_data.items():
        if field in ("evidence", "timeline", "counter_arguments") and value is not None:
            value = [
                item.model_dump() if hasattr(item, "model_dump") else item
                for item in value
            ]
        setattr(case, field, value)
    if "rejection_date" in update_data:
        case.appeal_deadline = _compute_deadline(update_data["rejection_date"])
    await db.commit()
    await db.refresh(case)
    return case


async def _get_owned_case(case_id: int, db: AsyncSession, user: User) -> Case:
    result = await db.execute(
        select(Case).where(Case.id == case_id, Case.user_id == user.id)
    )
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case


@router.get("/{case_id}/versions", response_model=List[DocumentVersionResponse])
async def list_versions(
    case_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(_require_user),
):
    await _get_owned_case(case_id, db, current_user)
    result = await db.execute(
        select(DocumentVersion)
        .where(DocumentVersion.case_id == case_id)
        .order_by(DocumentVersion.created_at.desc())
    )
    return result.scalars().all()


@router.get("/{case_id}/versions/{version_id}", response_model=DocumentVersionDetail)
async def get_version(
    case_id: int,
    version_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(_require_user),
):
    await _get_owned_case(case_id, db, current_user)
    result = await db.execute(
        select(DocumentVersion).where(
            DocumentVersion.id == version_id, DocumentVersion.case_id == case_id
        )
    )
    version = result.scalar_one_or_none()
    if not version:
        raise HTTPException(status_code=404, detail="Version not found")
    return version


@router.post("/{case_id}/versions/{version_id}/restore", response_model=CaseResponse)
async def restore_version(
    case_id: int,
    version_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(_require_user),
):
    case = await _get_owned_case(case_id, db, current_user)
    result = await db.execute(
        select(DocumentVersion).where(
            DocumentVersion.id == version_id, DocumentVersion.case_id == case_id
        )
    )
    version = result.scalar_one_or_none()
    if not version:
        raise HTTPException(status_code=404, detail="Version not found")
    case.generated_document = version.content
    await db.commit()
    await db.refresh(case)
    return case
