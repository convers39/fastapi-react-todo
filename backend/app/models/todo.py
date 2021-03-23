from pydantic import BaseConfig, BaseModel
from datetime import datetime, timezone

from .base import DBModelMixin, RWModel


class Todo(DBModelMixin):
    id: str = f"todo_{datetime.now().strftime('%Y%m%d%H%M%S')}"
    listId: str = ''
    task: str = ''
    tags: list = []
    date: str = datetime.now().strftime('%Y-%m-%d')  # bson does not have date type
    finished: bool = False
    deleted: bool = False

    class Config(BaseConfig):
        allow_population_by_field_name = True
        json_encoders = {
            datetime: lambda dt: dt.replace(tzinfo=timezone.utc)
            .isoformat()
            .replace("+00:00", "Z")
        }


class TodoUpdate(RWModel):
    listId: str = ''
    task: str = ''
    tags: list = []
    date: str = datetime.now().strftime('%Y-%m-%d')  # bson does not have date type
    finished: bool = False
    deleted: bool = False
    updatedAt: datetime
