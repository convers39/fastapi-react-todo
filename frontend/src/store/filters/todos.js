import Filter from './index'

export default class TodosFilter extends Filter {
  getItemsByList(listId) {
    return listId
      ? this.getItems().filter((item) => item.listId === listId)
      : this.getItems()
  }
}
