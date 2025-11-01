from utils.file_io import read_json_list, write_json_list
from models.project_model import Project

DATA_PATH = "data/projects.json"

def get_all_projects():
    return read_json_list(DATA_PATH)

def get_projects_by_owner(email: str):
    projects = read_json_list(DATA_PATH)
    return [p for p in projects if p.get("owner") == email]

def create_project(project: Project, email: str):
    projects = read_json_list(DATA_PATH)
    project.id = len(projects) + 1  
    project.owner = email           
    projects.append(project.dict())
    write_json_list(DATA_PATH, projects)
    return project.dict()

def update_project(project_id: int, updated: Project, email: str):
    projects = read_json_list(DATA_PATH)
    for p in projects:
        if p["id"] == project_id and p["owner"] == email:
            p.update(updated.dict(exclude_unset=True))
            write_json_list(DATA_PATH, projects)
            return p
    return None  

def get_project_by_id(project_id: int, email: str = None):
    projects = read_json_list(DATA_PATH)
    for p in projects:
        if p["id"] == project_id and (email is None or p["owner"] == email):
            return p
    return None
