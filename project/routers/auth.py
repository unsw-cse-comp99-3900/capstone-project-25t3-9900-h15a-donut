from fastapi import APIRouter, HTTPException
from passlib.hash import bcrypt
from utils.file_io import read_json_list, write_json_list, ensure_file
from utils.jwt_handler import create_jwt_token
from models.user_model import CompanyRegister, CompanyLogin

router = APIRouter()
USERS_PATH = "data/users.json"
ensure_file(USERS_PATH)

@router.post("/register")
def register(company: CompanyRegister):
    users = read_json_list(USERS_PATH)
    if any(u["email"].lower() == company.email.lower() for u in users):
        raise HTTPException(status_code=400, detail="Email already registered.")
    users.append({
        "email": company.email,
        "password_hash": bcrypt.hash(company.password),
        "company_name": company.company_name
    })
    write_json_list(USERS_PATH, users)
    return {"message": "Company registered successfully.", "email": company.email}

@router.post("/login")
def login(payload: CompanyLogin):
    users = read_json_list(USERS_PATH)
    for u in users:
        if u["email"].lower() == payload.email.lower() and bcrypt.verify(payload.password, u["password_hash"]):
            token = create_jwt_token(payload.email)
            return {"access_token": token, "token_type": "bearer"}
    raise HTTPException(status_code=401, detail="Invalid email or password.")
