import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';

const Header = ({share, setShare}) => {
    const { activeRoom, usersInRoom, onlineUsers } = useChat();
    const { user } = useAuth();
    const isUserOnline = (userId) => {
    if (!userId) return false;
    return onlineUsers.has(String(userId));
  };
    return (
        <div className="h-[76px] bg-[#0B1426]/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 z-10 sticky top-0 shadow-sm">
                <div className="flex items-center gap-3">
                    {(() => {
                    const activeDmUser = activeRoom && !activeRoom.is_group
                        ? usersInRoom?.[activeRoom._id]?.find((p) => p._id !== user._id)
                        : null;
                    const activeDmOnline = activeDmUser ? isUserOnline(activeDmUser._id) : false;

                    return (
                        <>
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
                    {activeDmUser && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 border border-white/10">
                        <span className={`w-2 h-2 rounded-full ${activeDmOnline ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${activeDmOnline ? 'text-emerald-300' : 'text-red-300'}`}>
                        {activeDmOnline ? 'Online' : 'Offline'}
                        </span>
                    </span>
                    )}
                        </>
                    );
                    })()}
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
    );
}


export default Header;



