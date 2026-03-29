import React, {useEffect, useRef} from 'react';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ setCreateRoom }) => {
  const navigate = useNavigate();
  const joinedRoomRef = useRef(null);
  const {
    groups,
    usersInRoom,
    joinroom,
    onlineUsers,
    fetchUsersInRoom,
    fetchChat,
    startDM,
    fetchRooms,
    privateChats,
    setActiveRoom,
    activeRoom
  } = useChat();

  const { user } = useAuth();
  const isUserOnline = (userId) => {
    if (!userId) return false;
    return onlineUsers.has(String(userId));
  };

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

  // 🔹 Start DM handler (clean)
  const handleStartDM = async (userId) => {
    try {
      const room = await startDM(userId);
      await fetchRooms();
      setActiveRoom(room);
      navigate(`/chat/${room._id}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-[320px] lg:w-[360px] bg-[#0F172A] h-screen border-r border-white/5 flex flex-shrink-0 shadow-2xl z-10">

      {/* LEFT ICON BAR */}
      <div className="w-[76px] bg-[#060913] h-screen border-r py-5 border-white/5 flex flex-col items-center gap-4 flex-shrink-0">

        {/* DM Button */}
        <div
          className={`w-12 h-12 rounded-[24px] hover:rounded-[16px] flex items-center justify-center cursor-pointer transition-all duration-300 shadow-md ${
            !activeRoom
              ? "bg-[#6C63FF] text-white"
              : "bg-[#1E293B] text-gray-400 hover:bg-[#6C63FF] hover:text-white"
          }`}
          onClick={() => {
            setActiveRoom(null);
            navigate('/chat');
          }}
        >
          <MessageCircle size={22} />
        </div>

        <div className="w-8 h-[2px] bg-white/10 rounded-full my-1"></div>

        {/* GROUPS */}
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
                setActiveRoom(room);
              }}
            >
              {room.room_name?.substring(0, 3).toUpperCase()}
            </div>
          ))}
        </div>

        {/* CREATE GROUP */}
        <button
          className="mt-auto mb-2 w-12 h-12 bg-[#1E293B] text-emerald-400 rounded-[24px] hover:rounded-[16px] flex items-center justify-center text-2xl font-light hover:bg-emerald-500 hover:text-white transition-all duration-300 shadow-md"
          onClick={() => setCreateRoom(true)}
        >
          +
        </button>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 py-6 px-4 overflow-y-auto bg-[#0F172A] custom-scrollbar">

        {/* GROUP MEMBERS */}
        {activeRoom && activeRoom.is_group ? (
          <>
            <div className="text-[11px] font-bold text-[#7D8CB7] uppercase tracking-[0.18em] mb-4 px-1 flex items-center justify-between">
              <span>Members</span>
              <span className="bg-[#121B37] border border-[#25345C] text-[#B8C4EA] px-2 py-0.5 rounded-full">
                {(usersInRoom?.[activeRoom._id] ?? []).length}
              </span>
            </div>

            <div className="space-y-2">
              {(usersInRoom?.[activeRoom._id] ?? []).map((p) => {
                const memberOnline = isUserOnline(p._id);

                return (
                  <div
                    key={p._id}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#121B37] border border-[#223059] hover:bg-[#172246] transition cursor-pointer justify-between group"
                  >
                    {/* USER INFO */}
                    <div className="flex items-center gap-3 flex-1 overflow-hidden">
                      <div className="relative w-11 h-11 rounded-full bg-[#6C63FF]/25 flex items-center justify-center text-sm font-bold">
                        {p.name?.charAt(0).toUpperCase()}
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${
                            memberOnline ? 'bg-emerald-400' : 'bg-[#FF5C76]'
                          }`}
                        />
                      </div>

                      <div className="flex flex-col truncate">
                        <span className="text-sm font-semibold">{p.name}</span>
                        <span className={`text-[10px] ${
                          memberOnline ? 'text-emerald-300' : 'text-red-300'
                        }`}>
                          {memberOnline ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>

                    {/* ACTION */}
                    {p._id === user._id ? (
                      <span className="text-xs text-gray-400">YOU</span>
                    ) : (
                      <button
                        onClick={() => handleStartDM(p._id)}
                        className="opacity-0 group-hover:opacity-100"
                      >
                        <MessageCircle size={18} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : privateChats.length > 0 ? (

          /* DM LIST */
          <>
            <div className="text-[11px] font-bold text-[#7D8CB7] uppercase mb-4">
              Direct Messages
            </div>

            <div className="space-y-2">
              {privateChats.map((room) => {
                const otherUser = (usersInRoom?.[room._id] ?? [])
                  .find(p => p._id !== user._id);

                const online = isUserOnline(otherUser?._id);

                return (
                  <div
                    key={room._id}
                    onClick={() => {
                      setActiveRoom(room);
                      navigate(`/chat/${room._id}`);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer bg-[#121B37] hover:bg-[#172246]"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#6C63FF]/25 flex items-center justify-center">
                      {otherUser?.name?.charAt(0)}
                    </div>

                    <div>
                      <p>{otherUser?.name}</p>
                      <span className={`text-xs ${online ? 'text-green-400' : 'text-red-400'}`}>
                        {online ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (

          /* EMPTY STATE */
          <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
            <MessageCircle size={28} />
            <p>No messages yet</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Sidebar;