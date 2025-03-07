import { useState } from 'react'
import './App.css'
import UserDashboard from './components/UserDashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   <UserDashboard/>
    </>
  )
}

export default App
