import React from 'react'
import { Provider } from 'mobx-react'
import { stores } from './store/index'
import './App.scss'
import TopBar from './components/TopBar'
import Sidebar from './components/SideBar'
import TodoListContainer from './components/TodoList'
import Header from './components/Header'

function App() {
  return (
    <Provider {...stores}>
      <div className='App'>
        <TopBar />
        <div className='content-wrapper'>
          <Sidebar />
          <main className='main-content'>
            <Header />
            <TodoListContainer />
          </main>
        </div>
      </div>
    </Provider>
  )
}

export default App
