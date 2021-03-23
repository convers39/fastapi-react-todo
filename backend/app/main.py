from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import main

from .core.config import get_settings, Settings
from .db.client import connect_to_mongo, close_connection, get_db, AsyncIOMotorClient
from .db.todo import fetch_todos

app = FastAPI()
settings = get_settings()


app.add_event_handler('startup', connect_to_mongo)
app.add_event_handler('shutdown', close_connection)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/ping')
async def pong():
    return {'ping': 'pong'}


@app.get('/todos')
async def get_todo(db: AsyncIOMotorClient = Depends(get_db)):
    res = await fetch_todos(db)
    return res
