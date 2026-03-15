import React from 'react'
import Bgimage from '../assets/Bgimage.png'
import { Link } from 'react-router-dom'
import Feature1 from '../assets/Feature1.png'
import Feature2 from '../assets/Feature2.png'
import Feature3 from '../assets/Feature3.png'

const Home = () => {
  return (
    <div className='relative flex flex-col items-center min-h-screen bg-[linear-gradient(to_bottom,#040814_0%,#0b1535_40%,#1a2850_100%)] text-white  overflow-hidden'>

      {/* glow */}
      <div className="absolute right-0 top-40 w-[400px] h-[400px] bg-indigo-500 animate-pulse blur-[180px] opacity-20"></div>

      {/* particles */}
      {Array.from({ length: 200 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-40"
          style={{
            top: `${Math.random()*100}%`,
            left: `${Math.random()*100}%`
          }}
        />
      ))}

      {/* Navbar */}
      <div className="sticky top-0 w-full backdrop-blur-lg bg-black/20 z-50">
        <div className="flex items-center justify-between px-6 py-4 max-w-full mx-auto">

          <div className="font-bold text-xl">
            ChatVerse
          </div>

          <div className="hidden md:flex gap-6">
            <div className='p-2 px-4 hover:bg-indigo-500 rounded-xl font-semibold'>Home</div>
            <div className='p-2 px-4 hover:bg-indigo-500 rounded-xl font-semibold'>Features</div>
            <div className='p-2 px-4 hover:bg-indigo-500 rounded-xl font-semibold'>About</div>
            <div className='p-2 px-4 hover:bg-indigo-500 rounded-xl font-semibold'>Contact</div>
          </div>

          <Link to='/login'>
            <button className="bg-indigo-500 px-5 py-2 rounded-full">
              Login
            </button>
          </Link>

        </div>
      </div>

      {/* HERO SECTION */}
      <section className="flex flex-col lg:flex-row items-center justify-between gap-16 px-6 lg:px-1 py-20 max-w-full mx-auto">

        <div className="flex flex-col gap-8 lg:w-[40%] text-center px-12 lg:text-left">

          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-7xl bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent animate-slide-up">
            GROUP CHAT <br/>
            THAT'S ALL <br/>
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              FUN AND GAMES
            </span>
          </h1>

          <p className="text-gray-300 text-lg">
            ChatVerse lets you create group chats, collaborate in real time,
            and share moments with friends effortlessly.
          </p>

          <div className="flex gap-4 justify-center lg:justify-start">
            <Link to='/signup'>
              <button className="bg-indigo-500 px-6 py-3 rounded-lg">
                Get Started
              </button>
            </Link>
          </div>

        </div>

        <div className="lg:w-[60%]">
          <img src={Bgimage} className="w-full scale-135"/>
        </div>

      </section>


      {/* FEATURE 1 */}
      <section className="w-[90%] lg:w-[90%] bg-[linear-gradient(to_bottom,#040814_0%,#0b1535_40%,#1a2850_100%)]  border border-white/10 flex flex-col lg:flex-row items-center gap-20 p-20 rounded-[60px] lg:rounded-[100px] mt-125">

        <div className="w-full bg-[linear-gradient(to_bottom,#040814_0%,#0b1535_40%,#1a2850_100%)] rounded-[60px] lg:w-[55%]">
          <img src={Feature1} className="w-full rounded-[60px]"/>
        </div>

        <div className="flex-1 text-center lg:text-left">

          <h2 className="font-extrabold text-3xl sm:text-4xl lg:text-6xl mb-6">
            MAKE YOUR GROUP CHATS MORE FUN
          </h2>

          <p className="text-gray-300 text-lg">
            Express yourself with emojis, reactions, and interactive
            conversations that bring your group chats to life.
          </p>

        </div>

      </section>


      {/* FEATURE 2 */}
      <section className="w-[90%] lg:w-[90%] bg-[linear-gradient(to_bottom,#040814_0%,#0b1535_40%,#1a2850_100%)]  border border-white/10 flex flex-col lg:flex-row items-center gap-20 p-20 rounded-[60px] lg:rounded-[100px] mt-125">

        <div className="w-full bg-[linear-gradient(to_bottom,#040814_0%,#0b1535_40%,#1a2850_100%)] rounded-[60px] lg:w-[55%] ">
          <img src={Feature2} className="w-full rounded-[60px]"/>
        </div>

        <div className="flex-1 text-center lg:text-left">

          <h2 className="font-extrabold text-3xl sm:text-4xl lg:text-6xl mb-6">
            REAL TIME MESSAGING
          </h2>

          <p className="text-gray-300 text-lg">
            Send and receive messages instantly using WebSocket powered
            communication.
          </p>

        </div>

      </section>


      {/* FEATURE 3 */}
      <section className="w-[90%] lg:w-[90%] bg-[linear-gradient(to_bottom,#040814_0%,#0b1535_40%,#1a2850_100%)]  border border-white/10 flex flex-col lg:flex-row items-center gap-20 p-20 rounded-[60px] lg:rounded-[100px] mt-125 mb-100">

        <div className="w-full bg-[linear-gradient(to_bottom,#040814_0%,#0b1535_40%,#1a2850_100%)] rounded-[60px] lg:w-[55%]" >
          <img src={Feature3} className="w-full rounded-[60px]"/>
        </div>

        <div className="flex-1 text-center lg:text-left">

          <h2 className="font-extrabold text-3xl sm:text-4xl lg:text-6xl mb-6">
            SHARE FILES AND MEDIA
          </h2>

          <p className="text-gray-300 text-lg">
            Easily upload images, documents, and media files to share with
            your friends and teammates.
          </p>

        </div>

      </section>

    </div>
  )
}

export default Home