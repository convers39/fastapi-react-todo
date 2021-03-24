import { createContext, useContext } from 'react'
import { TODO_STORE, TodoStore } from './todos'
import { AppStore, APP_STORE } from './app'
import { ListStore, LIST_STORE } from './lists'
import { TagStore, TAG_STORE } from './tags'

const stores = {
  [APP_STORE]: new AppStore(),
  [TODO_STORE]: new TodoStore(),
  [LIST_STORE]: new ListStore(),
  [TAG_STORE]: new TagStore()
}

// for functional components
const StoresContext = createContext(stores)
const useStores = () => useContext(StoresContext)

const useTodoStore = () => {
  const { todoStore } = useStores()
  return todoStore
}

const useAppStore = () => {
  const { appStore } = useStores()
  return appStore
}

const useListStore = () => {
  const { listStore } = useStores()
  return listStore
}

const useTagStore = () => {
  const { tagStore } = useStores()
  return tagStore
}

export {
  stores,
  StoresContext,
  useTodoStore,
  useAppStore,
  useTagStore,
  useListStore,
  APP_STORE,
  TODO_STORE,
  LIST_STORE,
  TAG_STORE
}
