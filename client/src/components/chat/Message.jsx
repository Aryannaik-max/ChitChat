import React, { useEffect, useRef } from 'react';
import { CornerUpLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';


const Message = ({ handleReplyToMessage }) => {
    const { activeRoom,  messages, usersInRoom } = useChat();
    const {user} = useAuth();
    const messagesEndRef = useRef(null);
    
        const activeRoomMessages = activeRoom ? (messages[activeRoom._id] || []) : [];
        const messagesById = activeRoomMessages.reduce((acc, currentMessage) => {
        acc[currentMessage._id] = currentMessage;
        return acc;
      }, {});

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [activeRoomMessages]);

  const getMessageSenderName = (msg) => {
    if (msg?.sender_id?.name) return msg.sender_id.name;
    const senderId = msg?.sender_id?._id || msg?.sender_id;
    if (!senderId || !activeRoom?._id) return 'Unknown';
    const roomUsers = usersInRoom?.[activeRoom._id] || [];
    const sender = roomUsers.find((u) => u._id === senderId);
    return sender?.name || 'Unknown';
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
    );
}

export default Message;




