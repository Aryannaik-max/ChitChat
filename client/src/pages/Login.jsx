import React, { useState } from 'react'
import ChitChatImg from '../assets/ChitChatImg.png'
import Email from '../assets/Email.png'
import Password from '../assets/Password.png'
import GoogleIcon from '../assets/Google.png'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3001/api/v1/auth/google';
  }

  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/chat');
    } catch (error) {
      console.log('Login failed:', error);
    }
  };

  return (
    <div className='relative w-full min-h-screen flex items-center justify-center bg-[linear-gradient(to_bottom,#040814_0%,#0b1535_40%,#1a2850_100%)] text-white overflow-hidden px-4 py-8'>

      {/* Glow effects */}
      <div className="absolute right-0 top-40 w-[500px] h-[500px] bg-indigo-500 blur-[200px] opacity-15 pointer-events-none" />
      <div className="absolute left-0 bottom-40 w-[300px] h-[300px] bg-purple-500 blur-[150px] opacity-10 pointer-events-none" />

      {/* Particles */}
      {Array.from({ length: 80 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-40 pointer-events-none"
          style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
        />
      ))}

      <div className='backdrop-blur-xl bg-white/5 border border-white/10 w-full max-w-5xl rounded-[2rem] shadow-2xl shadow-black/30 flex overflow-hidden'>

        {/* LEFT IMAGE PANEL — hidden on mobile */}
        <div className='hidden md:flex bg-gradient-to-br from-purple-500/15 to-indigo-600/15 w-[45%] flex-col justify-center items-center relative overflow-hidden p-8'>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent" />
          <img src={ChitChatImg} alt='ChatVerse' className='relative z-10 w-full max-w-xs drop-shadow-lg' />
        </div>

        {/* RIGHT FORM PANEL — full width on mobile, 55% on desktop */}
        <div className='w-full md:w-[55%] px-6 py-10 sm:px-10 sm:py-12 md:p-14 flex flex-col justify-center bg-gradient-to-bl from-slate-800/10 to-slate-900/20'>

          {/* Logo shown only on mobile since image panel is hidden */}
          <div className='flex justify-center mb-6 md:hidden'>
            <img src={ChitChatImg} alt='ChatVerse' className='w-32' />
          </div>

          <div className='max-w-md mx-auto w-full'>
            <h2 className='font-black text-3xl sm:text-4xl md:text-5xl font-Poppins text-center text-white mb-8 md:mb-12 tracking-tight'>
              Welcome Back
            </h2>

            <form className='flex flex-col gap-4 sm:gap-6' onSubmit={handleSubmit}>

              <div className='group relative'>
                <div className='absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-sm transition-all duration-300 group-focus-within:blur-md group-focus-within:opacity-75' />
                <div className='relative p-4 sm:p-5 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/10 focus-within:border-indigo-400/50 transition-all duration-300 flex items-center group-focus-within:bg-white/[0.05]'>
                  <img src={Email} alt='Email' className='w-5 h-5 sm:w-6 sm:h-6 opacity-60 mr-3 sm:mr-4' />
                  <input
                    type='email'
                    name='email'
                    placeholder='Email address'
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete='email'
                    className='placeholder-gray-400 font-medium font-Quicksand focus:outline-none text-white bg-transparent w-full text-base sm:text-lg'
                  />
                </div>
              </div>

              <div className='group relative'>
                <div className='absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-sm transition-all duration-300 group-focus-within:blur-md group-focus-within:opacity-75' />
                <div className='relative p-4 sm:p-5 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/10 focus-within:border-indigo-400/50 transition-all duration-300 flex items-center group-focus-within:bg-white/[0.05]'>
                  <img src={Password} alt='Password' className='w-5 h-5 sm:w-6 sm:h-6 opacity-60 mr-3 sm:mr-4' />
                  <input
                    type='password'
                    name='password'
                    placeholder='Password'
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete='current-password'
                    className='placeholder-gray-400 font-medium font-Quicksand focus:outline-none text-white bg-transparent w-full text-base sm:text-lg'
                  />
                </div>
              </div>

              <div className='relative mt-2'>
                <div className='absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-sm opacity-70' />
                <button
                  type='submit'
                  className='relative w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 font-Quicksand text-lg sm:text-xl text-white font-bold py-4 sm:py-5 px-8 rounded-2xl transition-all duration-300 active:scale-[0.99] shadow-lg'
                >
                  Login
                </button>
              </div>
            </form>

            <div className="flex items-center my-7 sm:my-10">
              <div className="grow border-t border-white/10" />
              <span className="mx-4 sm:mx-6 font-semibold font-Quicksand text-gray-400 text-xs sm:text-sm uppercase tracking-wider">OR</span>
              <div className="grow border-t border-white/10" />
            </div>

            <div className='relative' onClick={handleGoogleLogin}>
              <div className='absolute inset-0 bg-gradient-to-r from-slate-500/20 to-slate-400/20 rounded-2xl blur-sm opacity-50' />
              <button
                type="button"
                className="relative flex items-center justify-center bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] text-white font-bold font-Quicksand text-base sm:text-lg py-4 sm:py-5 pl-14 sm:pl-16 pr-6 sm:pr-8 rounded-2xl w-full backdrop-blur-sm transition-all duration-300 active:scale-[0.99]"
              >
                <div className="absolute left-3 sm:left-4 w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <img src={GoogleIcon} alt="Google" className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                Continue with Google
              </button>
            </div>

            <div className='text-center mt-6 sm:mt-8'>
              <p className='font-Quicksand font-medium text-gray-400 text-sm sm:text-base'>
                Don't have an account?{' '}
                <Link to='/signup' className='text-indigo-400 hover:text-indigo-300 transition-colors duration-300 font-semibold underline-offset-4 hover:underline'>
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login