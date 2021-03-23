
from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel, Field, BaseConfig


def to_camel(string: str) -> str:
    return ''.join(word.capitalize() for word in string.split('_'))


class DBModelMixin(BaseModel):
    createdAt: Optional[datetime] = Field(..., alias="createdAt")
    updatedAt: Optional[datetime] = Field(..., alias="updatedAt")


class RWModel(BaseModel):
    class Config(BaseConfig):
        allow_population_by_field_name = True
        alias_generator = to_camel
        json_encoders = {
            datetime: lambda dt: dt.replace(tzinfo=timezone.utc)
            .isoformat()
            .replace("+00:00", "Z")
        }
