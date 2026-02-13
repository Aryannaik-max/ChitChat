import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='bg-black w-full h-screen text-white '>
        This is a Chat Application
      </div>
    </>
  )
}

export default App
