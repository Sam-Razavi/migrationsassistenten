from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from app.models.case import DecisionType


class EvidenceItem(BaseModel):
    id: str
    label: str
    description: str = ""
    is_preset: bool = False
    checked: bool = False


class TimelineEntry(BaseModel):
    id: str
    date: str
    description: str


class CounterArgument(BaseModel):
    id: str
    category: str
    text: str


class CaseCreate(BaseModel):
    case_number: str
    applicant_name: str
    dob: str
    nationality: str
    rejection_date: str
    mv_reference: Optional[str] = None
    decision_type: DecisionType
    rejection_reason: Optional[str] = None


class CaseUpdate(BaseModel):
    case_number: Optional[str] = None
    applicant_name: Optional[str] = None
    dob: Optional[str] = None
    nationality: Optional[str] = None
    rejection_date: Optional[str] = None
    mv_reference: Optional[str] = None
    decision_type: Optional[DecisionType] = None
    rejection_reason: Optional[str] = None
    evidence: Optional[List[EvidenceItem]] = None
    timeline: Optional[List[TimelineEntry]] = None
    counter_arguments: Optional[List[CounterArgument]] = None
    generated_document: Optional[str] = None


class CaseResponse(BaseModel):
    id: int
    case_number: str
    applicant_name: str
    dob: str
    nationality: str
    rejection_date: str
    appeal_deadline: Optional[str] = None
    mv_reference: Optional[str] = None
    decision_type: DecisionType
    rejection_reason: Optional[str] = None
    evidence: Optional[List[EvidenceItem]] = None
    timeline: Optional[List[TimelineEntry]] = None
    counter_arguments: Optional[List[CounterArgument]] = None
    generated_document: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
