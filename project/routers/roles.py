from fastapi import APIRouter, Depends
from utils.file_io import read_json_list, write_json_list, ensure_file
from utils.auth_bearer import JWTBearer
from models.role_model import Role

router = APIRouter()
ROLES_PATH = "data/roles.json"
ensure_file(ROLES_PATH)

@router.get("/")
def list_roles():
    """Public: YP 可直接浏览"""
    return read_json_list(ROLES_PATH)

@router.post("/", dependencies=[Depends(JWTBearer())])
def create_role(role: Role):
    """Private: 仅公司（登录后）可创建"""
    roles = read_json_list(ROLES_PATH)
    roles.append(role.dict())
    write_json_list(ROLES_PATH, roles)
    return {"message": "Role created successfully.", "role": role.dict()}
