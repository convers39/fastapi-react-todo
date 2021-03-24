export const getTaskStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the tasks look a bit nicer
  userSelect: 'none',
  // change background colour if dragging
  opacity: isDragging && 0.9,
  // styles we need to apply on draggables
  ...draggableStyle
})

export const getListStyle = (isDraggingOver) => ({
  // background: isDraggingOver && 'lightgrey'
})

export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

export const onDragEnd = (result, todos) => {
  // dropped outside the list
  if (!result.destination) {
    return
  }
  const sourceIndex = result.source.index
  const destinationIndex = result.destination.index
  reorder(todos, sourceIndex, destinationIndex)

  const sourceId = todos[sourceIndex].id
  const destinationId = todos[destinationIndex].id
  return [sourceId, destinationId]
}
