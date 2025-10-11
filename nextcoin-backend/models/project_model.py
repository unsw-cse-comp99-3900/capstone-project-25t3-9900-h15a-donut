from pydantic import BaseModel, Field
from typing import List, Optional

class Project(BaseModel):
    title: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)
    budget: float = Field(..., ge=0)
    skills_required: List[str] = []
    timeline: Optional[str] = None
