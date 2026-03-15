import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home.jsx'
import Chat from './pages/Chat.jsx'
import { AuthProvider, useAuth } from "./context/AuthContext";

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AuthProvider>
      <Routes>
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Home />} />
        <Route path='/chat' element={<Chat />} />
      </Routes>
      </AuthProvider>
    </>

  )
}

export default App
