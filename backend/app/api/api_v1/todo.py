from fastapi import APIRouter, Body, Depends, Path
from pymongo import ReturnDocument
from fastapi.encoders import jsonable_encoder
from starlette.exceptions import HTTPException
from starlette.status import (
    HTTP_200_OK, HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_422_UNPROCESSABLE_ENTITY
)
from starlette.responses import JSONResponse

from ...models.todo import Todo, TodoUpdate
from ...db.client import get_db, AsyncIOMotorClient

router = APIRouter(
    prefix='/todos',
    tags=['todos'],
)


@router.get('')
async def fetch_todos(db: AsyncIOMotorClient = Depends(get_db)):
    todos = []
    cursor = db['TODOS'].find().sort('index')
    docs = await cursor.to_list(length=100)
    for doc in docs:
        todos.append(Todo(**doc))
    return todos


@router.post(
    '',
    status_code=HTTP_201_CREATED,
    responses={201: {'description': 'Item created'}}
)
async def create_todo(
    db: AsyncIOMotorClient = Depends(get_db),
    new_todo: Todo = Body(..., embed=True)
):

    new_todo = new_todo.dict()
    count = await db['TODOS'].count_documents({})
    new_todo['index'] = count + 1
    res = await db['TODOS'].insert_one(new_todo)
    if res.inserted_id:
        result = 'new todo has been created'
    else:
        result = 'failed to create new todo'

    return JSONResponse(content={'result': result})


@router.delete(
    '/{id}',
    status_code=HTTP_204_NO_CONTENT,
    responses={404: {'description': 'Item not found'},
               204: {'description': 'Item deleted'}}
)
async def delete_todo(
    db: AsyncIOMotorClient = Depends(get_db),
    id: str = Path(..., min_length=1)
):
    res = await db['TODOS'].find_one_and_delete({'id': id})

    if not res:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND,
                            detail='item not found')
    res.pop('_id')
    print('delete', res)
    return JSONResponse(content={'result': jsonable_encoder(res)}, status_code=HTTP_204_NO_CONTENT)


@router.put(
    '/{id}',
    status_code=HTTP_200_OK,
    responses={404: {'description': 'Item not found'},
               200: {'description': 'Item updated'}}
)
async def update_todo(
    db: AsyncIOMotorClient = Depends(get_db),
    id: str = Path(..., min_length=1),
    todo_data: TodoUpdate = Body(..., embed=True)
):
    print('update', todo_data.dict())
    res = await db['TODOS'].find_one_and_update(
        {'id': id}, {"$set": todo_data.dict()},
        return_document=ReturnDocument.AFTER
    )
    if not res:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND,
                            detail='item not found')

    return JSONResponse(content={'result': jsonable_encoder(TodoUpdate(**res))})


@router.put(
    '/toggle/{id}',
    status_code=HTTP_200_OK,
    responses={404: {'description': 'Item not found'},
               200: {'description': 'Item updated'}}
)
async def toggle_todo(
    db: AsyncIOMotorClient = Depends(get_db),
    id: str = Path(..., min_length=1),
):
    target = await db['TODOS'].find_one({'id': id})
    finished = not target['finished']
    res = await db['TODOS'].update_one({'id': id}, {"$set": {'finished': finished}})
    if not res:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND,
                            detail='item not found')

    return JSONResponse(content={'result': f'Item {id} has been updated'})
