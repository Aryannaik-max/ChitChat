import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
const MessageInput = ({ replyToMessage, setReplyToMessage }) => {
  const { activeRoom, sendMessage } = useChat();
    const { user } = useAuth();
    const [newMessage, setNewMessage] = useState('');
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
    return (
    <div className="p-6 bg-gradient-to-t from-[#0B1426] to-transparent ">
                <div className="max-w-8xl mx-auto bg-[#1E293B] border border-white/5  rounded-2xl p-2 focus-within:border-[#6C63FF]/50 focus-within:ring-4 focus-within:ring-[#6C63FF]/10 transition-all shadow-xl">
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
                <div className="flex gap-3 w-full ">
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
    )
}

export default MessageInput;
