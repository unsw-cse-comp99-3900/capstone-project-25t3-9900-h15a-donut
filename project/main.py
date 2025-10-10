from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, projects, roles

app = FastAPI(title="NextCoin Backend API", version="0.1.0")

# 允许前端访问（按需限制域名）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境请改成你的前端域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 路由
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
app.include_router(roles.router, prefix="/api/roles", tags=["Roles"])

@app.get("/")
def root():
    return {"message": "NextCoin API is running"}
