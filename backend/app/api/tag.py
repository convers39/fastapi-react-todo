from fastapi import APIRouter, Body, Depends, Path
from starlette.exceptions import HTTPException
from starlette.status import (
    HTTP_200_OK, HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_422_UNPROCESSABLE_ENTITY
)
from starlette.responses import JSONResponse

from ..models.tag import Tag, TagUpdate
from ..db.client import get_db, AsyncIOMotorClient

router = APIRouter(
    prefix='/tags',
    tags=['tags'],
    responses={404: {'description': 'Item not found'}}
)


@router.get('/tags')
async def fetch_tags(db: AsyncIOMotorClient = Depends(get_db)):
    tags = []
    cursor = db['TAGS'].find().sort('index')
    docs = await cursor.to_list(length=100)
    for doc in docs:
        tags.append(Tag(**doc))
    return tags


@router.post('/tags', status_code=HTTP_201_CREATED)
async def create_tag(
    db: AsyncIOMotorClient = Depends(get_db),
    new_tag: Tag = Body(..., embed=True)
):

    new_tag = new_tag.dict()
    # add tag name check
    name = new_tag['name'].lower()
    check_existence = await db['TAGS'].find_one({'name': name})
    if check_existence:
        raise HTTPException(status_code=HTTP_422_UNPROCESSABLE_ENTITY,
                            detail='This tag name has been used')

    res = await db['TAGS'].insert_one(new_tag)
    if res.inserted_id:
        result = 'new tag has been created'
    else:
        result = 'failed to create new tag'

    return JSONResponse(content={'result': result})


@router.delete('/tags/{id}', status_code=HTTP_204_NO_CONTENT)
async def delete_tag(
    db: AsyncIOMotorClient = Depends(get_db),
    id: str = Path(..., min_length=1)
):

    res = await db['TAGS'].delete_one({'id': id})
    if res.deleted_count == 1:
        result = f'item {id} has been deleted'
    else:
        result = f'failed to delete item {id}'
    return JSONResponse(content={'result': result})


@router.put('/tags/{id}', status_code=HTTP_200_OK)
async def update_tag(
    db: AsyncIOMotorClient = Depends(get_db),
    id: str = Path(..., min_length=1),
    tag_data: TagUpdate = Body(..., embed=True)
):

    res = await db['TAGS'].update_one({'id': id}, {"$set": tag_data.dict()},)
    if res.modified_count == 1:
        result = f'item {id} has been updated'
    else:
        result = f'failed to update item {id}'
    return JSONResponse(content={'result': result})
