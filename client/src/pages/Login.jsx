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
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/v1/auth/google';
  }

  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
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
      <div className='relative w-full min-h-screen flex items-center justify-center bg-[linear-gradient(to_bottom,#040814_0%,#0b1535_40%,#1a2850_100%)] text-white overflow-hidden'>
        
        {/* glow effect */}
        <div className="absolute right-0 top-40 w-[500px] h-[500px] bg-indigo-500 blur-[200px] opacity-15"></div>
        <div className="absolute left-0 bottom-40 w-[300px] h-[300px] bg-purple-500 blur-[150px] opacity-10"></div>
        
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
        
        <div className='backdrop-blur-xl bg-white/5 border border-white/10 w-full max-w-7xl rounded-[2.5rem] shadow-2xl shadow-black/30 mx-4 flex overflow-hidden min-h-[600px] max-h-[900px] '>
          <div className='bg-gradient-to-br from-purple-500/15 to-indigo-600/15 w-[45%] flex flex-col justify-center items-center relative overflow-hidden'>
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent"></div>
            
            <div className='relative z-10 text-center mb-8'>
              <img src={ChitChatImg} alt='ChatVerse' className='w-full max-w-sm mx-auto drop-shadow-lg' />
            </div>
            {/* < div className='relative z-10'>
              <h1 className='text-5xl sm:text-6xl font-Poppins  font-semibold/600 text-white  leading-tight'>Welcome to</h1>
              <h1 className='text-7xl sm:text-8xl font-Poppins font-bold/700 mb-6 leading-tight'>ChatVerse</h1>
            </div> */}
          </div>
          <div className='w-[55%] p-16 flex flex-col justify-center bg-gradient-to-bl from-slate-800/10 to-slate-900/20'>
            <div className='max-w-md mx-auto w-full'>
              <h2 className=' font-black text-5xl font-Poppins font-semibold/600 text-center text-white mb-12 tracking-tight'>Welcome Back</h2>
            <div>
              <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
                
                <div className='group relative'>
                  <div className='absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-sm transition-all duration-300 group-focus-within:blur-md group-focus-within:opacity-75'></div>
                  <div className='relative p-5 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/10 focus-within:border-indigo-400/50 transition-all duration-300 flex items-center group-focus-within:bg-white/[0.05]'>
                    <img src={Email} alt='Email' className='w-6 h-6 opacity-60 mr-4 transition-opacity duration-300 group-focus-within:opacity-80' />
                    <input
                      type='email'
                      name='email'
                      placeholder='Email address'
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete='email'
                      className='placeholder-gray-400 font-medium font-Quicksand focus:outline-none text-white bg-transparent w-full text-lg'
                    />
                  </div>
                </div>
                
                <div className='group relative'>
                  <div className='absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-sm transition-all duration-300 group-focus-within:blur-md group-focus-within:opacity-75'></div>
                  <div className='relative p-5 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/10 focus-within:border-indigo-400/50 transition-all duration-300 flex items-center group-focus-within:bg-white/[0.05]'>
                    <img src={Password} alt='Password' className='w-6 h-6 opacity-60 mr-4 transition-opacity duration-300 group-focus-within:opacity-80' />
                    <input
                      type='password'
                      name='password'
                      placeholder='Password'
                      value={formData.password}
                      onChange={handleChange}
                      required
                      autoComplete='current-password'
                      className='placeholder-gray-400 font-medium font-Quicksand focus:outline-none text-white bg-transparent w-full text-lg'
                    />
                  </div>
                </div>
                
                <div className='relative mt-4'>
                  <div className='absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-sm opacity-70 transition-all duration-300 hover:opacity-90'></div>
                  <button type='submit' className='relative w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 font-Quicksand text-xl text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 hover:scale-[1.01] shadow-lg hover:shadow-indigo-500/25'>Login</button>
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
                    <div className=''>
                      Continue with Google
                    </div>
                  </button>
                </div>
                <div className='text-center mt-8'>
                  <p className='font-Quicksand font-medium text-gray-400'>Don't have an account? <Link to='/signup' className='text-indigo-400 hover:text-indigo-300 transition-colors duration-300 font-semibold underline-offset-4 hover:underline'>Sign up</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default Login