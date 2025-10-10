from fastapi import APIRouter, Depends
from utils.file_io import read_json_list, write_json_list, ensure_file
from utils.auth_bearer import JWTBearer
from models.project_model import Project

router = APIRouter()
PROJECTS_PATH = "data/projects.json"
ensure_file(PROJECTS_PATH)

@router.get("/")
def list_projects():
    """Public: YP 可直接浏览"""
    return read_json_list(PROJECTS_PATH)

@router.post("/", dependencies=[Depends(JWTBearer())])
def create_project(project: Project):
    """Private: 仅公司（登录后）可创建"""
    projects = read_json_list(PROJECTS_PATH)
    projects.append(project.dict())
    write_json_list(PROJECTS_PATH, projects)
    return {"message": "Project created successfully.", "project": project.dict()}
