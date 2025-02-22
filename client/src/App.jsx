import React from 'react'
import { Button } from './components/ui/button'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <>
    <main>
      <Outlet/>
    </main>
    </>
  )
}

export default App
