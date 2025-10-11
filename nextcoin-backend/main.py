from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, projects, roles

app = FastAPI(title="NextCoin API", version="1.0.0")

# CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 包含路由
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(roles.router)

@app.get("/")
async def root():
    return {"message": "NextCoin API is running"}
