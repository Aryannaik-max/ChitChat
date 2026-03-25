import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { CornerUpLeft, MessageCircle, X } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const Chat = () => {
  const { user, authToken } = useAuth();
  const { roomid } = useParams();
  const { groups, messages, fetchChat, sendMessage, createGroup, joinroom, fetchRooms, fetchUsersInRoom, usersInRoom, startDM, privateChats} = useChat();
  const navigate = useNavigate();

  const [activeRoom, setActiveRoom] = useState(null);
  const [joinRoom, setJoinRoom] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [createRoom, setCreateRoom] = useState(false);
  const [groupStep, setGroupStep] = useState(1);
  const [groupName, setGroupName] = useState('');
  const [share, setShare] = useState(false);
  const [joiningViaCode, setJoiningViaCode] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState(null);

  const messagesEndRef = useRef(null);
  const joinedRoomRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (activeRoom?._id) {
      fetchChat(activeRoom._id);
      fetchUsersInRoom(activeRoom._id); 
      console.log("Users in room after fetch:", usersInRoom);
      if (joinedRoomRef.current !== activeRoom._id) {
        joinroom(activeRoom._id);
        joinedRoomRef.current = activeRoom._id;
      }
    }
  }, [activeRoom?._id, fetchChat, joinroom, fetchUsersInRoom]);

  useEffect(() => {
  if (privateChats.length > 0) {
    privateChats.forEach(room => {
      if (!usersInRoom?.[room._id]) {
        fetchUsersInRoom(room._id);
      }
    });
  }
}, [privateChats]);

  useEffect(() => {
  if (!roomid) return;

  const allRooms = [...groups, ...privateChats];

  const room = allRooms.find(r => r._id === roomid);

  if (room) {
    setActiveRoom(room);
  }
}, [roomid, groups, privateChats]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeRoom) return;
    try {
      await sendMessage(activeRoom._id, newMessage, user._id, replyToMessage?._id);
      setNewMessage('');
      setReplyToMessage(null);
    } catch (err) {
      console.log(err);
    }
  };

  const activeRoomMessages = activeRoom ? (messages[activeRoom._id] || []) : [];
  const messagesById = activeRoomMessages.reduce((acc, currentMessage) => {
    acc[currentMessage._id] = currentMessage;
    return acc;
  }, {});

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;
    try {
      await createGroup(groupName, user._id);
      setGroupName('');
      setCreateRoom(false);
      setGroupStep(1);
    } catch (err) {
      console.log(err);
    }
  };
  // const startDM = async (otherUserId) => {
  //   try {
  //     const response = await 
  //   } catch (error) {
      
  //   }
  // }
  const handleJoinViaCode = async () => {
    const code = joinRoom.trim();
    if (!code) return;

    setJoiningViaCode(true);
    try {
      const res = await fetch(`${API_BASE_URL}/invite/${code}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Invalid invite code");
      }

      const data = await res.json();

      await fetchRooms();

      setJoinRoom('');
      setCreateRoom(false);
      setGroupStep(1);
      navigate(`/chat/${data.data._id}`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Invalid invite code");
    } finally {
      setJoiningViaCode(false);
    }
  };

  const handleShareInvite = async () => {
    try {
      const link = `${window.location.origin}/invite/${activeRoom.invite_link}`;
      await navigator.clipboard.writeText(link);
      alert("Invite link copied to clipboard!");
    } catch (error) {
      console.log("Error sharing invite link:", error);
    }
  };

  const getMessageSenderName = (msg) => {
    if (msg?.sender_id?.name) return msg.sender_id.name;
    const senderId = msg?.sender_id?._id || msg?.sender_id;
    if (!senderId || !activeRoom?._id) return 'Unknown';
    const roomUsers = usersInRoom?.[activeRoom._id] || [];
    const sender = roomUsers.find((u) => u._id === senderId);
    return sender?.name || 'Unknown';
  };

  const handleReplyToMessage = (msg) => {
    setReplyToMessage({
      _id: msg._id,
      content: msg.content,
      senderName: getMessageSenderName(msg)
    });
  };

  const getReplyPreview = (msg) => {
    if (!msg?.reply_to) return null;

    const replyReference = msg.reply_to;
    const resolvedMessage =
      typeof replyReference === 'object'
        ? replyReference
        : messagesById[replyReference];

    if (resolvedMessage) {
      return {
        senderName: getMessageSenderName(resolvedMessage),
        content: resolvedMessage.content || 'Message unavailable'
      };
    }

    return {
      senderName: 'Original message',
      content: 'Replied message not loaded'
    };
  };

  const formatMessageTime = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-[#0B1426] h-screen flex text-gray-200 font-sans overflow-hidden">

      {/* SIDEBAR CONTAINER */}
      <div className="w-[320px] lg:w-[360px] bg-[#0F172A] h-screen border-r border-white/5 flex flex-shrink-0 shadow-2xl z-10">

        {/* GROUP COLUMN (Narrow Left Bar) */}
        <div className="w-[76px] bg-[#060913] h-screen border-r py-5 border-white/5 flex flex-col items-center gap-4 flex-shrink-0">

          {/* DM */}
          <div
            className={`w-12 h-12 rounded-[24px] hover:rounded-[16px] flex items-center justify-center cursor-pointer transition-all duration-300 shadow-md ${!activeRoom ? "bg-[#6C63FF] text-white" : "bg-[#1E293B] text-gray-400 hover:bg-[#6C63FF] hover:text-white"}`}
            onClick={() => {
              setActiveRoom(null);
              joinedRoomRef.current = null;
              navigate('/chat');
            }}
          >
            <MessageCircle size={22} />
          </div>

          <div className="w-8 h-[2px] bg-white/10 rounded-full my-1"></div>

          {/* ROOMS */}
          <div className="flex flex-col gap-3 overflow-y-auto w-full items-center pb-4 scrollbar-hide">
            {groups.map(room => (
              <div
                key={room._id}
                className={`w-12 h-12 flex items-center justify-center text-center p-2 cursor-pointer text-[11px] font-bold tracking-wide transition-all duration-300 shadow-sm overflow-hidden leading-tight ${
                  activeRoom?._id === room._id 
                    ? "rounded-[16px] bg-[#6C63FF] text-white shadow-lg shadow-[#6C63FF]/30" 
                    : "rounded-[24px] hover:rounded-[16px] bg-[#1E293B] text-gray-400 hover:bg-[#6C63FF] hover:text-white"
                }`}
                onClick={() => {
                  navigate(`/chat/${room._id}`);
                  joinedRoomRef.current = null;
                  setActiveRoom(room);
                }}
              >
                {room.room_name?.substring(0, 3).toUpperCase()}
              </div>
            ))}
          </div>

          {/* CREATE GROUP BUTTON */}
          <button
            className="mt-auto mb-2 w-12 h-12 bg-[#1E293B] text-emerald-400 rounded-[24px] hover:rounded-[16px] flex items-center justify-center text-2xl font-light hover:bg-emerald-500 hover:text-white transition-all duration-300 shadow-md"
            onClick={() => setCreateRoom(true)}
          >
            +
          </button>
        </div>

        {/* SECOND SIDEBAR (Members & Info) */}
        <div className="flex-1 py-6 px-4 overflow-y-auto bg-[#0F172A] custom-scrollbar">
          {activeRoom && activeRoom.is_group? (
            <>
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-3 flex items-center justify-between">
                <span>Members</span>
                <span className="bg-white/10 px-2 py-0.5 rounded-full">{(usersInRoom?.[activeRoom._id] ?? []).length}</span>
              </div>
              <div className="space-y-1">
                {(usersInRoom?.[activeRoom._id] ?? []).map((p) => (
                    <div
                      key={p._id}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all duration-200 cursor-pointer justify-between group"
                    >
                      {/* Avatar + Info */}
                      <div className="flex items-center gap-3 flex-1 overflow-hidden">
                        <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-tr from-[#6C63FF] to-[#9D95FF] flex items-center justify-center text-sm font-bold text-white shadow-sm ring-2 ring-transparent group-hover:ring-white/10 transition-all">
                          {p.name?.charAt(0).toUpperCase()}
                        </div>

                        {/* Name + Role */}
                        <div className="flex flex-col truncate">
                          <span className="text-sm text-gray-200 font-medium truncate flex items-center gap-2">
                            {p.name}
                            {p._id === activeRoom.admin_id && (
                              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                                Admin
                              </span>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Right side actions */}
                      <span className="shrink-0">
                        {p._id === user._id ? (
                          <span className="text-[10px] text-gray-500 font-bold bg-black/20 px-2 py-1 rounded-md">YOU</span>
                        ) : (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110" onClick={async ()=>{
                            const room = await startDM(p._id);
                            await fetchRooms();
                            setActiveRoom(room);
                            navigate(`/chat/${room._id}`);
                          }}>
                            <MessageCircle size={18} className="text-gray-400 hover:text-white transition-colors" />
                          </div>
                        )}
                      </span>
                    </div>
                  ))}
              </div>
            </>
          ) : (
              privateChats.length > 0 ? (
              <>
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-3">
                  Direct Messages
                </div>
                <div className="space-y-1">
                  {privateChats.map((room) => {
                    const otherUser = (usersInRoom?.[room._id] ?? [])
                      .find(p => p._id !== user._id);

                    return (
                      <div
                        key={room._id}
                        onClick={() => {
                          navigate(`/chat/${room._id}`);
                          setActiveRoom(room);
                        }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group ${
                          activeRoom?._id === room._id
                            ? "bg-[#6C63FF] text-white shadow-md shadow-[#6C63FF]/20"
                            : "hover:bg-white/5 text-gray-300"
                        }`}
                      >
                        <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${
                          activeRoom?._id === room._id ? "bg-white/20 text-white" : "bg-[#1E293B] text-gray-400 group-hover:text-white group-hover:bg-gray-700 transition-colors"
                        }`}>
                          {otherUser?.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium truncate text-sm">
                          {otherUser?.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
) : (
              <div className="h-full flex flex-col items-center justify-center text-center px-6 opacity-60">
                <div className="w-16 h-16 bg-[#1E293B] rounded-full flex items-center justify-center mb-4">
                  <MessageCircle size={28} className="text-gray-500" />
                </div>
                <p className="text-sm font-medium text-gray-300 mb-1">No messages yet</p>
                <p className="text-xs text-gray-500 leading-relaxed">Join a group or start a direct message to begin chatting.</p>
              </div>
    )
          )}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col relative bg-[#0B1426]">

        {/* HEADER */}
        <div className="h-[76px] bg-[#0B1426]/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 z-10 sticky top-0 shadow-sm">
          <div className="flex items-center gap-3">
            {console.log("Active Room:", activeRoom)}
            {activeRoom && (
              <span className="text-gray-500 text-2xl font-light select-none">#</span>
            )}
            <span className="text-lg font-bold text-white tracking-wide">
              {activeRoom ? (
                activeRoom.is_group
                  ? activeRoom.room_name
                  : (
                      usersInRoom?.[activeRoom._id]?.find(p => p._id !== user._id)?.name || "Chat"
                  )
              ) : (
                "Welcome"
              )}
            </span>
          </div>

          {activeRoom && activeRoom.is_group && activeRoom.admin_id === user._id && (
            <button 
              onClick={() => setShare(true)}
              className="px-4 py-2 bg-[#1E293B] hover:bg-white/10 text-gray-200 rounded-lg text-sm font-semibold transition-all duration-200 border border-white/5 hover:border-white/10 flex items-center gap-2"
            >
              Share Invite
            </button>
          )}
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-6 space-y-1">
          {activeRoom && activeRoomMessages.map((msg) => {
            const isMine = msg.sender_id === user._id || msg.sender_id?._id === user._id;
            const replyPreview = getReplyPreview(msg);
            const senderName =   getMessageSenderName(msg);
            const messageTime = formatMessageTime(msg.createdAt);
            return (
              <div
                key={msg._id}
                className="group relative rounded-xl px-3 py-2 hover:bg-white/[0.03] transition-colors animate-fade-in-up"
              >
                <div className="absolute right-3 top-2 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                  <button
                    onClick={() => {
                      handleReplyToMessage(msg)
                    }}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#101B33] border border-white/10 text-gray-200 transition-all duration-200 hover:bg-[#162447]"
                    title="Reply in thread"
                  >
                    <span className="flex items-center gap-1.5">
                      <CornerUpLeft size={14} />
                      Reply
                    </span>
                  </button>
                </div>

                <div className="pr-20">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`text-sm font-semibold ${isMine ? 'text-[#AFA9FF]' : 'text-white'}`}>
                      {senderName}
                    </p>
                    {messageTime && (
                      <span className="text-[11px] text-gray-500">{messageTime}</span>
                    )}
                  </div>

                  <div className="text-[15px] leading-relaxed text-gray-100">
                    {replyPreview && (
                      <div className={`mb-2 px-2.5 py-2 rounded-lg border text-xs ${
                        isMine
                          ? 'bg-black/15 border-white/20 text-indigo-100'
                          : 'bg-[#111B33] border-white/10 text-gray-300'
                      }`}>
                        <p className="font-semibold truncate">{replyPreview.senderName}</p>
                        <p className="truncate opacity-90">{replyPreview.content}</p>
                      </div>
                    )}
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} className="h-4"></div>
        </div>

        {/* MESSAGE INPUT */}
        {activeRoom && (
          <div className="p-6 bg-gradient-to-t from-[#0B1426] to-transparent">
            <div className="max-w-5xl mx-auto bg-[#1E293B] border border-white/5 rounded-2xl p-2 focus-within:border-[#6C63FF]/50 focus-within:ring-4 focus-within:ring-[#6C63FF]/10 transition-all shadow-xl">
              {replyToMessage && (
                <div className="mx-2 mb-2 px-3 py-2 rounded-xl border border-[#6C63FF]/30 bg-[#111B33] flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wider text-[#9D95FF] font-bold">Replying to {replyToMessage.senderName}</p>
                    <p className="text-xs text-gray-300 truncate">{replyToMessage.content}</p>
                  </div>
                  <button
                    onClick={() => setReplyToMessage(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Cancel reply"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              <div className="flex gap-3">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={replyToMessage ? `Reply to ${replyToMessage.senderName}...` : `Message ${activeRoom.is_group ? '#' + activeRoom.room_name : 'user'}...`}
                className="flex-1 bg-transparent px-4 py-2.5 text-gray-200 outline-none placeholder-gray-500 font-medium"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="px-8 py-2.5 bg-[#6C63FF] text-white rounded-xl hover:bg-[#5A52D9] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md"
              >
                Send
              </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SHARE MODAL */}
      {share && (
        <div className="fixed inset-0 bg-[#0B1426]/80 backdrop-blur-md flex items-center justify-center z-50 transition-all">
          <div className="bg-[#0F172A] w-[440px] p-8 rounded-3xl border border-white/10 shadow-2xl relative">
            <button className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition" onClick={() => setShare(false)}>✕</button>
            <h2 className="text-2xl font-bold text-white mb-2">Invite Friends</h2>
            <p className="text-sm text-gray-400 mb-6">Share this exclusive link to let others join your server.</p>
            <div className="flex gap-2">
              <input
                value={activeRoom ? `${window.location.origin}/invite/${activeRoom.invite_link}` : ""}
                readOnly
                className="flex-1 bg-[#060913] border border-white/10 px-4 py-3.5 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-white/20 transition-colors"
              />
              <button 
                onClick={handleShareInvite} 
                className="bg-[#6C63FF] hover:bg-[#5A52D9] active:scale-95 transition-all text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-[#6C63FF]/20"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / JOIN MODAL */}
      {createRoom && (
        <div className="fixed inset-0 bg-[#0B1426]/80 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-[#0F172A] w-[440px] p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            <button
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
              onClick={() => { setCreateRoom(false); setGroupStep(1); }}
            >✕</button>

            {/* STEP 1 */}
            {groupStep === 1 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-center text-white mb-2">Create or Join</h2>
                <p className="text-gray-400 text-sm text-center mb-8 px-4">
                  Your server is where you and your friends hang out. Make yours or join one.
                </p>

                <div className="space-y-6">
                  <div className="bg-[#1E293B]/50 p-5 rounded-2xl border border-white/5">
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Have an invite code?</label>
                    <div className='flex gap-2'>
                      <input
                        type='text'
                        placeholder='Enter invite code'
                        value={joinRoom}
                        onChange={(e) => setJoinRoom(e.target.value)}
                        className='bg-[#060913] px-4 py-3 rounded-xl flex-1 outline-none text-white focus:ring-2 focus:ring-[#6C63FF]/50 border border-white/5 transition-all'
                      />
                      <button
                        className='px-6 py-3 bg-[#6C63FF] text-white font-semibold rounded-xl hover:bg-[#5A52D9] active:scale-95 transition-all disabled:opacity-50 shadow-md'
                        onClick={handleJoinViaCode}
                        disabled={joiningViaCode || !joinRoom.trim()}
                      >
                        {joiningViaCode ? "Joining..." : "Join"}
                      </button>
                    </div>
                  </div>

                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-white/5"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-500 text-xs font-bold uppercase tracking-widest">OR</span>
                    <div className="flex-grow border-t border-white/5"></div>
                  </div>

                  <button
                    className="w-full bg-[#1E293B] hover:bg-white/10 border border-white/5 text-white font-semibold py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 group"
                    onClick={() => setGroupStep(2)}
                  >
                    <span>Create My Own Server</span>
                    <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {groupStep === 2 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-center text-white mb-2">Customize your server</h2>
                <p className="text-gray-400 text-sm text-center mb-8">Give your new server a personality with a name.</p>
                
                <div className="mb-8">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Server Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Gamer's Paradise"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full bg-[#060913] border border-white/5 px-4 py-3.5 rounded-xl text-white outline-none focus:border-[#6C63FF]/50 focus:ring-2 focus:ring-[#6C63FF]/20 transition-all text-sm font-medium"
                  />
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setGroupStep(1)} 
                    className="flex-1 py-3.5 bg-transparent hover:bg-white/5 rounded-xl text-gray-300 hover:text-white font-semibold transition-all"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleCreateGroup} 
                    disabled={!groupName.trim()}
                    className="flex-[2] py-3.5 bg-[#6C63FF] text-white font-semibold rounded-xl hover:bg-[#5A52D9] active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-[#6C63FF]/20"
                  >
                    Create Server
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;