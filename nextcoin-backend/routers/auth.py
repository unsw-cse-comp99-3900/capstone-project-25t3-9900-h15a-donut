from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from passlib.hash import bcrypt
from utils.file_io import read_json_list, write_json_list, ensure_file
from utils.jwt_handler import create_jwt_token
from models.user_model import CompanyRegister, CompanyLogin

# 添加路由前缀
router = APIRouter(prefix="/auth", tags=["Authentication"])
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

# 保持原有的JSON登录
@router.post("/login")
def login(payload: CompanyLogin):
    users = read_json_list(USERS_PATH)
    for u in users:
        if u["email"].lower() == payload.email.lower() and bcrypt.verify(payload.password, u["password_hash"]):
            token = create_jwt_token(payload.email)
            return {
                "access_token": token, 
                "token_type": "bearer",
                "user_info": {
                    "email": u["email"],
                    "company_name": u["company_name"]
                }
            }
    raise HTTPException(status_code=401, detail="Invalid email or password.")

# 添加Form登录（用于前端FormData请求）
@router.post("/login-form")
def login_form(form_data: OAuth2PasswordRequestForm = Depends()):
    users = read_json_list(USERS_PATH)
    for u in users:
        if u["email"].lower() == form_data.username.lower() and bcrypt.verify(form_data.password, u["password_hash"]):
            token = create_jwt_token(form_data.username)
            return {
                "access_token": token, 
                "token_type": "bearer",
                "user_info": {
                    "email": u["email"],
                    "company_name": u["company_name"]
                }
            }
    raise HTTPException(status_code=401, detail="Invalid email or password.")
