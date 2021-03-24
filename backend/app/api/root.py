from fastapi import APIRouter

from .api_v1.todo import router as todo_router
from .api_v1.list import router as list_router
from .api_v1.tag import router as tag_router

root_router = APIRouter(prefix='/api')
root_router.include_router(todo_router)
root_router.include_router(list_router)
root_router.include_router(tag_router)
