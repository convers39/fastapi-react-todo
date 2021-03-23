
from ..models.todo import Todo


async def fetch_todos(db):
    todos = []
    cursor = db['TODOS'].find()
    docs = await cursor.to_list(length=100)
    for document in docs:
        print('doc', document, document['task'])
        todos.append(Todo(**document))
    return todos


async def create_todo():
    return


async def delete_todo():
    return


async def update_todo():
    return
