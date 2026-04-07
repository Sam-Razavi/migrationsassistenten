from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class DocumentVersionResponse(BaseModel):
    id: int
    case_id: int
    label: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class DocumentVersionDetail(DocumentVersionResponse):
    content: str
