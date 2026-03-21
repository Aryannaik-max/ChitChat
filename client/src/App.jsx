import { Routes, Route, Navigate } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home.jsx'
import InviteHandler from './pages/InviteHandler.jsx'
import Chat from './pages/Chat.jsx'
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";

import './App.css'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  return children
}

function App() {
  return (
    <>
      <AuthProvider>
        <ChatProvider>
          <Routes>
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
            <Route path='/' element={<Home />} />
            <Route
              path='/chat'
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path='/invite/:token'
              element={
                <ProtectedRoute>
                  <InviteHandler/>
                </ProtectedRoute>
              }
              />
            <Route
              path='/chat/:chatid'
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
          </Routes>
        </ChatProvider>
      </AuthProvider>
    </>

  )
}

export default App
