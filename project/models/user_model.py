from pydantic import BaseModel, EmailStr

class CompanyRegister(BaseModel):
    email: EmailStr
    password: str
    company_name: str

class CompanyLogin(BaseModel):
    email: EmailStr
    password: str
