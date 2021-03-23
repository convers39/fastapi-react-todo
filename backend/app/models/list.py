from pydantic import BaseConfig, BaseModel
from datetime import datetime, timezone

from .base import DBModelMixin


class List(DBModelMixin):
    id: str = f"list_{datetime.now().strftime('%Y%m%d%H%M%S')}"
    name: str = ''

    class Config(BaseConfig):
        allow_population_by_field_name = True
        json_encoders = {
            datetime: lambda dt: dt.replace(tzinfo=timezone.utc)
            .isoformat()
            .replace("+00:00", "Z")
        }


class ListUpdate(BaseModel):
    name: str = ''
    updatedAt: datetime
