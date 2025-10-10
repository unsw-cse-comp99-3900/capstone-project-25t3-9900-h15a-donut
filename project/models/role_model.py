from pydantic import BaseModel, Field
from typing import List, Optional

class Role(BaseModel):
    title: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)
    skills: List[str] = []
    salary: Optional[float] = None
