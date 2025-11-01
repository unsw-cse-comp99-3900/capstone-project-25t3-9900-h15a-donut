from utils.file_io import read_json_list, write_json_list
from models.role_model import Role

DATA_PATH = "data/roles.json"

def get_all_roles():
    return read_json_list(DATA_PATH)

def get_roles_by_owner(email: str):
    roles = read_json_list(DATA_PATH)
    return [r for r in roles if r.get("owner") == email]

def create_role(role: Role, email: str):
    roles = read_json_list(DATA_PATH)
    role.id = len(roles) + 1
    role.owner = email
    roles.append(role.dict())
    write_json_list(DATA_PATH, roles)
    return role.dict()

def update_role(role_id: int, updated: Role, email: str):
    roles = read_json_list(DATA_PATH)
    for r in roles:
        if r["id"] == role_id and r["owner"] == email:
            r.update(updated.dict(exclude_unset=True))
            write_json_list(DATA_PATH, roles)
            return r
    return None

def get_role_by_id(role_id: int, email: str = None):
    roles = read_json_list(DATA_PATH)
    for r in roles:
        if r["id"] == role_id and (email is None or r["owner"] == email):
            return r
    return None
