import enum
from datetime import datetime
from sqlalchemy import String, Text, Enum as SAEnum, DateTime, JSON, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class DecisionType(str, enum.Enum):
    family_reunification = "family_reunification"
    asylum = "asylum"
    permanent_residence = "permanent_residence"
    work_permit = "work_permit"


class Case(Base):
    __tablename__ = "cases"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True
    )
    case_number: Mapped[str] = mapped_column(String(100), nullable=False)
    applicant_name: Mapped[str] = mapped_column(String(200), nullable=False)
    dob: Mapped[str] = mapped_column(String(20), nullable=False)
    nationality: Mapped[str] = mapped_column(String(100), nullable=False)
    rejection_date: Mapped[str] = mapped_column(String(20), nullable=False)
    appeal_deadline: Mapped[str | None] = mapped_column(String(20), nullable=True)
    mv_reference: Mapped[str | None] = mapped_column(String(200), nullable=True)
    decision_type: Mapped[DecisionType] = mapped_column(SAEnum(DecisionType), nullable=False)
    rejection_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    evidence: Mapped[list | None] = mapped_column(JSON, nullable=True, default=list)
    timeline: Mapped[list | None] = mapped_column(JSON, nullable=True, default=list)
    counter_arguments: Mapped[list | None] = mapped_column(JSON, nullable=True, default=list)
    generated_document: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    owner: Mapped["User"] = relationship("User", back_populates="cases")  # type: ignore[name-defined]
    versions: Mapped[list["DocumentVersion"]] = relationship("DocumentVersion", back_populates="case", cascade="all, delete-orphan")  # type: ignore[name-defined]
