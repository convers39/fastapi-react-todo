from fastapi import APIRouter

from .todo import router as todo_router
from .list import router as list_router
from .tag import router as tag_router

root_router = APIRouter()
root_router.include_router(todo_router)
root_router.include_router(list_router)
root_router.include_router(tag_router)
