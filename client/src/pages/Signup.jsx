import React from 'react'
import ChitChatImg from '../assets/ChitChatImg.png'
import User from '../assets/User.png'
import Email from '../assets/Email.png'
import Password from '../assets/Password.png'
import GoogleIcon from '../assets/Google.png'
import { Link } from 'react-router-dom'
import Signupimage from '../assets/Signupimage.png'

const Signup = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/v1/auth/google';
  }
  
  return (
    <div className='relative w-full min-h-screen flex items-center justify-center bg-[linear-gradient(to_bottom,#040814_0%,#0b1535_40%,#1a2850_100%)] text-white overflow-hidden'>
        
      {/* glow effect */}
      <div className="absolute left-0 top-60 w-[500px] h-[500px] bg-purple-500 blur-[200px] opacity-15"></div>
      <div className="absolute right-0 bottom-40 w-[300px] h-[300px] bg-indigo-500 blur-[150px] opacity-10"></div>
      
      {/* particles */}
      {Array.from({ length: 150 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-40"
          style={{
            top: `${Math.random()*100}%`,
            left: `${Math.random()*100}%`
          }}
        />
      ))}
      
      <div className='backdrop-blur-xl bg-white/5 border border-white/10 w-full max-w-7xl rounded-[2.5rem] shadow-2xl shadow-black/30 mx-4 flex overflow-hidden min-h-[600px]'>
        <div className='bg-gradient-to-br from-purple-500/15 to-indigo-600/15 w-[45%]  p-12 flex flex-col justify-center items-center relative overflow-hidden'>
          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent"></div>
          
          <div className='relative z-10 text-center mb-8'>
            <img src={Signupimage} alt='ChatVerse' className='w-full max-w-lg mx-auto drop-shadow-lg' />
          </div>
          {/* <div className='relative z-10 text-center'>
            <h1 className='text-5xl sm:text-6xl font-Quicksand font-black text-white mb-3 leading-tight'>Join</h1>
            <h1 className='text-7xl sm:text-8xl font-Quicksand font-black bg-gradient-to-r from-purple-300 via-indigo-300 to-pink-300 bg-clip-text text-transparent mb-6 leading-tight'>ChatVerse</h1>
            <p className='text-gray-300 text-xl font-medium max-w-md mx-auto leading-relaxed'>Create your account and start connecting with friends</p>
          </div> */}
        </div>
        <div className='w-[55%] p-16 flex flex-col justify-center bg-gradient-to-bl from-slate-800/10 to-slate-900/20'>
          <div className='max-w-md mx-auto w-full'>
            <h2 className='font-Quicksand font-black text-5xl text-center text-white mb-12 tracking-tight'>Create Your Account</h2>
            <div>
              <form className='flex flex-col gap-6'>
                
                <div className='group relative'>
                  <div className='absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-2xl blur-sm transition-all duration-300 group-focus-within:blur-md group-focus-within:opacity-75'></div>
                  <div className='relative p-5 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/10 focus-within:border-purple-400/50 transition-all duration-300 flex items-center group-focus-within:bg-white/[0.05]'>
                    <img src={User} alt='User' className='w-6 h-6 opacity-60 mr-4 transition-opacity duration-300 group-focus-within:opacity-80' />
                    <input type='text' placeholder='Username' className='placeholder-gray-400 font-medium font-Quicksand focus:outline-none text-white bg-transparent w-full text-lg' />
                  </div>
                </div>
                
                <div className='group relative'>
                  <div className='absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-2xl blur-sm transition-all duration-300 group-focus-within:blur-md group-focus-within:opacity-75'></div>
                  <div className='relative p-5 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/10 focus-within:border-purple-400/50 transition-all duration-300 flex items-center group-focus-within:bg-white/[0.05]'>
                    <img src={Email} alt='Email' className='w-6 h-6 opacity-60 mr-4 transition-opacity duration-300 group-focus-within:opacity-80' />
                    <input type='email' placeholder='Email address' className='placeholder-gray-400 font-medium font-Quicksand focus:outline-none text-white bg-transparent w-full text-lg'  />
                  </div>
                </div>
                
                <div className='group relative'>
                  <div className='absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-2xl blur-sm transition-all duration-300 group-focus-within:blur-md group-focus-within:opacity-75'></div>
                  <div className='relative p-5 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/10 focus-within:border-purple-400/50 transition-all duration-300 flex items-center group-focus-within:bg-white/[0.05]'>
                    <img src={Password} alt='Password' className='w-6 h-6 opacity-60 mr-4 transition-opacity duration-300 group-focus-within:opacity-80' />
                    <input type='password' placeholder='Password' className='placeholder-gray-400 font-medium font-Quicksand focus:outline-none text-white bg-transparent w-full text-lg' />
                  </div>
                </div>
                
                <div className='relative mt-4'>
                  <div className='absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur-sm opacity-70 transition-all duration-300 hover:opacity-90'></div>
                  <button type='submit' className='relative w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-Quicksand text-xl text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 hover:scale-[1.01] shadow-lg hover:shadow-purple-500/25'>Sign Up</button>
                </div>
            </form>
              <div className="flex items-center my-10">
                <div className="grow border-t border-white/10"></div>
                <span className="mx-6 font-semibold font-Quicksand text-gray-400 text-sm uppercase tracking-wider">OR</span>
                <div className="grow border-t border-white/10"></div>
              </div>
           <div className='relative' onClick={handleGoogleLogin}>
                 <div className='absolute inset-0 bg-gradient-to-r from-slate-500/20 to-slate-400/20 rounded-2xl blur-sm opacity-50 transition-all duration-300 hover:opacity-70'></div>
                 <button
                    type="button"
                    className="
                      relative flex items-center
                      justify-center
                      bg-white/[0.02] border border-white/10 hover:bg-white/[0.05]
                      text-white font-bold font-Quicksand text-lg
                      py-5 pl-16 pr-8
                      rounded-2xl w-full
                      backdrop-blur-sm
                      transition-all duration-300 hover:scale-[1.01] hover:border-white/20
                    "
                  >
                    <div
                      className="
                        absolute left-4
                        w-10 h-10
                        bg-white
                        rounded-xl
                        flex items-center justify-center
                        shadow-lg
                      "
                    >
                      <img src={GoogleIcon} alt="Google" className="w-6 h-6" />
                    </div>
                    <div>
                      Sign up with Google 
                    </div>
                  </button>
                </div>
                <div className='text-center mt-8'>
                  <p className='font-Quicksand font-medium text-gray-400'>Already have an account? <Link to='/login' className='text-indigo-400 hover:text-indigo-300 transition-colors duration-300 font-semibold underline-offset-4 hover:underline'>Login</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default Signup
