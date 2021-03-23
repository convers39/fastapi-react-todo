from pydantic import BaseModel
import datetime


class Todo(BaseModel):
    listId: str
    task: str
    tags: list
    date: datetime.date
    finished: bool
    deleted: bool
    created: datetime.datetime
