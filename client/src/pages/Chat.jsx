import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Chat = () => {
  const [messages, setMessages] = useState([
   
  ])
  
  const [newMessage, setNewMessage] = useState('')
  const [activeChannel, setActiveChannel] = useState('general')
  const messagesEndRef = useRef(null)

  const channels = [
    { name: 'general', icon: '#', count: 12 },
    { name: 'tasks', icon: '#' },
    { name: 'dev-discussion', icon: '#' },
    { name: 'design', icon: '#' },
    { name: 'resources', icon: '#' }
  ]

  const directMessages = [
    { name: 'Alex', avatar: 'A', online: true },
    { name: 'Luna', avatar: 'L', online: true },
    { name: 'Bailey', avatar: 'B', online: false },
    { name: 'Eli', avatar: 'E', online: true },
    { name: 'Ray', avatar: 'R', online: true, hasNotification: true }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        text: newMessage,
        sender: "You",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: "Y",
        isOwn: true
      }
      setMessages([...messages, newMsg])
      setNewMessage('')
    }
  }

  const getAvatarColor = (avatar) => {
    const colors = [
      'from-purple-500 to-indigo-500',
      'from-blue-500 to-cyan-500', 
      'from-green-500 to-teal-500',
      'from-yellow-500 to-orange-500',
      'from-pink-500 to-rose-500',
      'from-red-500 to-pink-500'
    ]
    return colors[avatar.charCodeAt(0) % colors.length]
  }

  return (
    <div className='flex h-screen bg-[#1e1f22] text-white'>
      
      {/* Server/Sidebar Icon */}
      <div className='w-[72px] bg-[#0b0c0f] flex flex-col items-center py-3 space-y-2'>
        <div className='w-12 h-12 bg-[#5865f2] rounded-[24px] hover:rounded-[16px] transition-all duration-200 flex items-center justify-center cursor-pointer relative'>
          <span className='font-bold text-white'>CC</span>
          <div className='absolute left-[-8px] top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0'></div>
        </div>
        
        <div className='w-8 h-[2px] bg-[#1e1f22] rounded-full'></div>
        
        {/* Additional servers */}
        <div className='w-12 h-12 bg-[#1e1f22] rounded-[24px] hover:rounded-[16px] hover:bg-[#5865f2] transition-all duration-200 flex items-center justify-center cursor-pointer'>
          <span className='text-[#dcddde] text-xl'>+</span>
        </div>
      </div>

      {/* Left Sidebar */}
      <div className='w-[240px] bg-[#111214] flex flex-col'>
        
        {/* Server Header */}
        <div className='h-12 border-b border-[#0b0c0f] flex items-center justify-between px-4 shadow-sm'>
          <h1 className='font-semibold text-white'>ChatVerse Project</h1>
          <svg className="w-4 h-4 text-[#b9bbbe]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Channels */}
        <div className='flex-1 overflow-y-auto'>
          <div className='p-2'>
            
            
            {/* <div className='mb-4'>
              <div className='flex items-center justify-between px-2 py-1 mb-1'>
                <span className='text-xs font-semibold text-[#8e9297] uppercase tracking-wide'>Text Channels</span>
                <svg className="w-4 h-4 text-[#8e9297] cursor-pointer hover:text-[#dcddde]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              
              {channels.map((channel) => (
                <div 
                  key={channel.name}
                  onClick={() => setActiveChannel(channel.name)}
                  className={`flex items-center px-2 py-1 mx-1 rounded cursor-pointer group ${
                    activeChannel === channel.name 
                      ? 'bg-[#1e1f22] text-white' 
                      : 'text-[#8e9297] hover:bg-[#1e1f22] hover:text-[#dcddde]'
                  }`}
                >
                  <span className='mr-1.5 text-[#8e9297]'>{channel.icon}</span>
                  <span className='flex-1 text-sm'>{channel.name}</span>
                  {channel.count && (
                    <span className='text-xs bg-[#f23f42] text-white rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center'>
                      {channel.count}
                    </span>
                  )}
                  <svg className="w-4 h-4 text-[#b9bbbe] opacity-0 group-hover:opacity-100 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              ))}
            </div> */}

            {/* Direct Messages */}
            <div>
              <div className='flex items-center justify-between px-2 py-1 mb-1'>
                <span className='text-xs font-semibold text-[#8e9297] uppercase tracking-wide'>Direct Messages</span>
                <svg className="w-4 h-4 text-[#8e9297] cursor-pointer hover:text-[#dcddde]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              
              {directMessages.map((user) => (
                <div 
                  key={user.name}
                  className='flex items-center px-2 py-1 mx-1 rounded cursor-pointer text-[#8e9297] hover:bg-[#1e1f22] hover:text-[#dcddde] group'
                >
                  <div className='relative mr-3'>
                    <div className={`w-8 h-8 bg-gradient-to-r ${getAvatarColor(user.avatar)} rounded-full flex items-center justify-center text-sm font-semibold text-white`}>
                      {user.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-[#111214] rounded-full ${
                      user.online ? 'bg-[#3ba55c]' : 'bg-[#747f8d]'
                    }`}></div>
                  </div>
                  <span className='flex-1 text-sm'>{user.name}</span>
                  {user.hasNotification && (
                    <div className='w-2 h-2 bg-[#f23f42] rounded-full'></div>
                  )}
                  <svg className="w-4 h-4 text-[#b9bbbe] opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Area */}
        <div className='h-[52px] bg-[#0b0c0f] flex items-center px-2'>
          <div className='flex items-center flex-1'>
            <div className='relative mr-2'>
              <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-sm font-semibold'>
                Y
              </div>
              <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-[#3ba55c] border-2 border-[#0b0c0f] rounded-full'></div>
            </div>
            <div className='flex-1 min-w-0'>
              <div className='text-sm font-semibold text-white truncate'>You</div>
              <div className='text-xs text-[#b9bbbe] truncate'>#1234</div>
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            <button className='p-1 text-[#b9bbbe] hover:text-[#dcddde]'>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
              </svg>
            </button>
            <button className='p-1 text-[#b9bbbe] hover:text-[#dcddde]'>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className='flex-1 flex flex-col bg-[#1e1f22]'>
        
        {/* Chat Header */}
        <div className='h-12 border-b border-[#111214] flex items-center px-4 shadow-sm'>
          <div className='flex items-center'>
            <span className='text-[#8e9297] mr-2'>#</span>
            <h2 className='font-semibold text-white'>{activeChannel}</h2>
          </div>
          <div className='ml-auto flex items-center space-x-4'>
            <button className='p-1 text-[#b9bbbe] hover:text-[#dcddde]'>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className='p-1 text-[#b9bbbe] hover:text-[#dcddde]'>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className='flex-1 overflow-y-auto px-4 py-4'>
          {messages.map((message, index) => {
            const showAvatar = index === 0 || messages[index - 1].sender !== message.sender
            
            return (
              <div key={message.id} className={`flex ${showAvatar ? 'mt-4' : 'mt-1'} hover:bg-[#0f1011] -mx-4 px-4 py-0.5 group`}>
                {showAvatar ? (
                  <div className='mr-4 mt-0.5'>
                    <div className={`w-10 h-10 bg-gradient-to-r ${getAvatarColor(message.avatar)} rounded-full flex items-center justify-center font-semibold text-white cursor-pointer hover:shadow-lg transition-shadow`}>
                      {message.avatar}
                    </div>
                  </div>
                ) : (
                  <div className='w-10 mr-4 flex justify-center'>
                    <span className='text-xs text-[#72767d] opacity-0 group-hover:opacity-100 leading-5 mt-0.5 font-medium'>
                      {message.timestamp}
                    </span>
                  </div>
                )}
                
                <div className='flex-1 min-w-0'>
                  {showAvatar && (
                    <div className='flex items-baseline mb-1'>
                      <span className='font-medium text-white mr-2 cursor-pointer hover:underline'>
                        {message.sender}
                      </span>
                      <span className='text-xs text-[#72767d] font-medium'>
                        {message.timestamp}
                      </span>
                    </div>
                  )}
                  
                  <div className='text-[#dcddde] break-words'>
                    {message.text}
                  </div>
                  
                  {message.hasImage && (
                    <div className='mt-2'>
                      <div className='w-64 h-40 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center border border-[#111214]'>
                        <div className='text-center text-[#8e9297]'>
                          <div className='w-12 h-12 bg-[#5865f2] rounded-full flex items-center justify-center mx-auto mb-2'>
                            <span className='text-2xl'>🤖</span>
                          </div>
                          <p className='text-sm font-medium'>Join Us</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className='px-4 pb-6'>
          <form onSubmit={handleSendMessage}>
            <div className='bg-[#111214] rounded-lg px-4 py-3'>
              <input
                type='text'
                placeholder={`Message #${activeChannel}`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className='w-full bg-transparent text-[#dcddde] placeholder-[#72767d] focus:outline-none'
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Chat