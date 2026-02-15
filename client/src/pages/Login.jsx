import React from 'react'
import backgroundImage from '../assets/Background.png'
import ChitChatImg from '../assets/ChitChatImg.png'
import Email from '../assets/Email.png'
import Password from '../assets/Password.png'
import GoogleIcon from '../assets/Google.png'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
      <div style={{backgroundImage: `url(${backgroundImage})`}} className='w-full min-h-screen flex items-center justify-center bg-cover bg-center'>
        <div className='bg-[#E2DF9F] w-full max-w-7xl lg:h-200 rounded-2xl  shadow-2xl shadow-black/70  mx-4 flex '>
          <div className='bg-[#F4F9D9] w-[50%] h-full rounded-2xl p-10'>
            <div className=''>
              <img src={ChitChatImg} alt='ChitChat' className='' />
            </div>
            <div className='p-10'>
              <div className='text-5xl font-Quicksand font-extrabold '>signup to</div>
              <div className='text-8xl font-Quicksand font-extrabold '>ChitChat</div>
            </div>
          </div>
          <div className='w-[50%] p-20 '>
            <div className='font-Quicksand font-extrabold text-5xl text-center '>Welcome Back </div>
            <div>
              <form className='flex flex-col gap-5 mt-10'>
                
                <div className='p-3 rounded-full placeholder-black font-bold font-Quicksand border-2 border-black focus:outline-none text-black flex items-center'>
                  <img src={Email} alt='Email' className='w-7 font-bold inline-block  mr-2' />
                  <input type='email' placeholder='Email' className='placeholder-black font-bold font-Quicksand focus:outline-none text-black'  />
                </div>
                <div className='p-3 rounded-full placeholder-black font-bold font-Quicksand border-2 border-black focus:outline-none text-black flex items-center'>
                  <img src={Password} alt='Password' className='w-6 inline-block mr-2' />
                  <input type='password' placeholder='Password' className='placeholder-black font-bold font-Quicksand focus:outline-none text-black' />
                </div >
                <button type='submit' className='bg-[#D73405] font-Quicksand text-xl text-[#E2DF9F] font-extrabold py-3 px-6 rounded-full hover:scale-105  transition duration-300'>Login</button>
              </form>
              <div className="flex items-center my-6">
                <div className="grow border-t border-black"></div>
                <span className="mx-4 font-bold font-Quicksand">OR</span>
                <div className="grow border-t border-black"></div>
              </div>
             <button
                type="button"
                className="
                  relative flex items-center
                  justify-center
                  bg-[#D73405] 
                  text-[#E2DF9F] font-extrabold font-Quicksand text-xl
                  py-3 pl-14 pr-8
                  rounded-full
                  shadow-md
                  transition hover:scale-105
                  w-full
                  text-center
                "
              >
                <div
                  className="
                    absolute left-2
                    w-10 h-10
                    bg-[#E2DF9F]
                    rounded-full
                    flex items-center justify-center
                  "
                >
                  <img src={GoogleIcon} alt="Google" className="w-10 h-10" />
                </div>
                <div>
                  Login with Google 
                </div>
              </button>
              <div>
                <p className='mt-5 font-Quicksand font-bold text-center'>Don't have an account? <Link to='/signup' className='text-[#D73405]'>Signup</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default Login