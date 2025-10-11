from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from utils.jwt_handler import decode_jwt_token

class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super().__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super().__call__(request)
        if credentials is None or credentials.scheme.lower() != "bearer":
            raise HTTPException(status_code=403, detail="Invalid auth scheme.")
        _ = decode_jwt_token(credentials.credentials)  # will raise if invalid
        return credentials.credentials
