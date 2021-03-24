import React, { Component } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import TodoItem from './TodoItem'
import { inject, observer } from 'mobx-react'
import { TODO_STORE } from '../store'
import { getTaskStyle, getListStyle, onDragEnd } from '../utils/dnd'
import styles from '../styles/style.module.scss'
@inject(TODO_STORE)
@observer
class TodoDragDrop extends Component {
  render() {
    const { todos } = this.props
    const handleDragEnd = (result) => {
      const [sourceId, destinationId] = onDragEnd(result, todos)
      this.props[TODO_STORE].updateTodoOrder(sourceId, destinationId)
    }

    return (
      <>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId='droppable'>
            {(provided, snapshot) => (
              <div className={styles.content}>
                <ul className={styles.todo_tasks}>
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {todos?.length ? (
                      todos.map((todo, index) => (
                        <Draggable
                          key={todo.id}
                          draggableId={todo.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getTaskStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              <TodoItem todo={todo} />
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <h3>No task</h3>
                    )}
                    {provided.placeholder}
                  </div>
                </ul>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </>
    )
  }
}

export default TodoDragDrop
