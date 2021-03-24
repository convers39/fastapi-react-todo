from fastapi import APIRouter, Body, Depends, Path
from pydantic import BaseModel
from starlette.exceptions import HTTPException
from starlette.status import (
    HTTP_200_OK, HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_422_UNPROCESSABLE_ENTITY
)
from starlette.responses import JSONResponse

from ..models.list import List, ListUpdate
from ..db.client import get_db, AsyncIOMotorClient

router = APIRouter(
    prefix='/lists',
    tags=['lists'],
)


@router.get('/lists')
async def fetch_lists(db: AsyncIOMotorClient = Depends(get_db)):
    lists = []
    cursor = db['LISTS'].find().sort('index')
    docs = await cursor.to_list(length=100)
    for doc in docs:
        lists.append(List(**doc))
    return lists


@router.post('/lists', status_code=HTTP_201_CREATED)
async def create_list(
    db: AsyncIOMotorClient = Depends(get_db),
    new_list: List = Body(..., embed=True)
):

    new_list = new_list.dict()
    # add list name check
    name = new_list['name'].lower()
    check_existence = await db['LISTS'].find_one({'name': name})
    if check_existence:
        raise HTTPException(status_code=HTTP_422_UNPROCESSABLE_ENTITY,
                            detail='This list name has been used')

    res = await db['LISTS'].insert_one(new_list)
    if res.inserted_id:
        result = 'new list has been created'
    else:
        result = 'failed to create new list'

    return JSONResponse(content={'result': result})


@router.delete(
    '/lists/{id}',
    status_code=HTTP_204_NO_CONTENT,
    responses={404: {'description': 'Item not found'}}
)
async def delete_list(
    db: AsyncIOMotorClient = Depends(get_db),
    id: str = Path(..., min_length=1)
):

    res = await db['LISTS'].delete_one({'id': id})
    if res.deleted_count == 1:
        result = f'item {id} has been deleted'
    else:
        result = f'failed to delete item {id}'
    return JSONResponse(content={'result': result})


@router.put(
    '/lists/{id}',
    status_code=HTTP_200_OK,
    responses={404: {'description': 'Item not found'}}
)
async def update_list(
    db: AsyncIOMotorClient = Depends(get_db),
    id: str = Path(..., min_length=1),
    list_data: ListUpdate = Body(..., embed=True)
):

    res = await db['LISTS'].update_one({'id': id}, {"$set": list_data.dict()},)
    if res.modified_count == 1:
        result = f'item {id} has been updated'
    else:
        result = f'failed to update item {id}'
    return JSONResponse(content={'result': result})
