import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';

const Header = ({share, setShare, setSidebarOpen}) => {
    const { activeRoom, usersInRoom, onlineUsers } = useChat();
    const { user } = useAuth();
    const isUserOnline = (userId) => {
    if (!userId) return false;
    return onlineUsers.has(String(userId));
  };

    const roomLabel = activeRoom
    ? activeRoom.is_group
      ? activeRoom.room_name
      : usersInRoom?.[activeRoom._id]?.find((p) => p._id !== user._id)?.name || 'Chat'
    : 'Welcome';

    return (
        <div className="h-[64px] sm:h-[76px] bg-[#0B1426]/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between sm:px-6 px-3 md:px-8 z-10 sticky top-0 shadow-sm">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button className="md:hidden flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors duration-200 text-xl" onClick={() => setSidebarOpen(true)}>☰</button>
                    {(() => {
                    const activeDmUser = activeRoom && !activeRoom.is_group
                        ? usersInRoom?.[activeRoom._id]?.find((p) => p._id !== user._id)
                        : null;
                    const activeDmOnline = activeDmUser ? isUserOnline(activeDmUser._id) : false;

                    return (
                        <>
                    {console.log("Active Room:", activeRoom)}
                    {activeRoom && (
                    <span className="text-gray-500 text-xl sm:text-2xl font-light select-none flex-shrink-0">#</span>
                    )}

                     <span className="text-base sm:text-lg font-bold text-white tracking-wide truncate max-w-[120px] xs:max-w-[180px] sm:max-w-xs md:max-w-sm lg:max-w-none">
          {roomLabel}
        </span>
                    {activeDmUser && (
                    <span className="inline-flex flex-shrink-0  items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-white/5 border border-white/10">
                        <span className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${activeDmOnline ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider hidden xs:inline ${activeDmOnline ? 'text-emerald-300' : 'text-red-300'}`}>
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



