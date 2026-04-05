import React, { useEffect, useRef, useState } from 'react';
import { CornerUpLeft, X, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';



const Lightbox = ({ src, onClose }) => {
  useEffect(() => {
    const handleKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleDownload = async () => {
    const res = await fetch(src);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'image';
    a.click();
    URL.revokeObjectURL(url);
  };

  

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div className="absolute top-3 right-3 flex gap-2 z-10">
        <button
          onClick={(e) => { e.stopPropagation(); handleDownload(); }}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
        >
          <Download size={18} />
        </button>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
        >
          <X size={18} />
        </button>
      </div>
      <img
        src={src}
        alt="preview"
        className="max-w-full max-h-[85vh] rounded-xl shadow-2xl object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};


const Message = ({ handleReplyToMessage }) => {
  const { activeRoom, messages, usersInRoom } = useChat();
  const { user, token } = useAuth();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api/v1';
  const messagesEndRef = useRef(null);
  ;
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const activeRoomMessages = activeRoom ? (messages[activeRoom._id] || []) : [];
  const messagesById = activeRoomMessages.reduce((acc, msg) => {
    acc[msg._id] = msg;
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
      typeof replyReference === 'object' ? replyReference : messagesById[replyReference];

  if (resolvedMessage) {
  return {
    senderName: getMessageSenderName(resolvedMessage),
    type: resolvedMessage.type,
    url: resolvedMessage.content,
    fileName: resolvedMessage.fileName,
    content: resolvedMessage.content || 'Message unavailable',
  };
}
    return { senderName: 'Original message', content: 'Replied message not loaded' };
  };

  const formatMessageTime = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const getFileDisplayName = (msg) => {
    if (msg?.fileName) return msg.fileName;
    try {
      return decodeURIComponent(msg.content.split('/').pop().split('?')[0]);
    } catch {
      return 'file';
    }
  };

  const handleDownloadFile = async (fileUrl, fileName) => {
    try {
      if (!token) throw new Error('Authentication token missing');
      const query = new URLSearchParams({ url: fileUrl, fileName: fileName || 'file' });
      const response = await fetch(`${BACKEND_URL}/download?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to download file');
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = fileName || 'file';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error('Download failed, opening direct URL:', error);
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <>
      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}

      <div className="flex-1 overflow-y-auto px-2 sm:px-6 py-4 space-y-1 ">
        {activeRoom && activeRoomMessages.map((msg) => {
          const isMine = msg.sender_id === user._id || msg.sender_id?._id === user._id;
          const replyPreview = getReplyPreview(msg);
          const senderName = getMessageSenderName(msg);
          const messageTime = formatMessageTime(msg.createdAt);

          return (
            <div
              key={msg._id}
              className="group relative rounded-xl px-2 sm:px-3 py-2 hover:bg-white/[0.03] transition-colors"
            >
              {/* Reply button — always visible on mobile (no hover needed), hover on desktop */}
              <div className="absolute right-2 sm:right-3 top-2 opacity-100 sm:opacity-0 sm:translate-y-1 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-200">
                <button
                  onClick={() => handleReplyToMessage(msg)}
                  className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold bg-[#101B33] border border-white/10 text-gray-200 transition-all duration-200 hover:bg-[#162447]"
                  title="Reply"
                >
                  <CornerUpLeft size={13} />
                </button>
              </div>

              {/* pr-10 on mobile (smaller button), pr-20 on desktop */}
              <div className="pr-10 sm:pr-20">
                {/* Sender + time */}
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className={`text-sm font-semibold ${isMine ? 'text-[#AFA9FF]' : 'text-white'}`}>
                    {senderName}
                  </p>
                  {messageTime && (
                    <span className="text-[11px] text-gray-500">{messageTime}</span>
                  )}
                </div>

                <div className="text-[14px] sm:text-[15px] leading-relaxed text-gray-100">
                  {/* Reply preview */}
                  {replyPreview && (
                    <div className={`mb-2 px-2.5 py-2 rounded-lg border text-xs ${
                      isMine
                        ? 'bg-black/15 border-white/20 text-indigo-100'
                        : 'bg-[#111B33] border-white/10 text-gray-300'
                    }`}>
                     <p className="font-semibold truncate">{replyPreview.senderName}</p>
{replyPreview.type === 'image' ? (
  <div className="flex items-center gap-2 mt-1">
    <img
      src={replyPreview.url}
      alt="replied image"
      className="w-10 h-10 rounded-lg object-cover border border-white/10 flex-shrink-0"
    />

  </div>
) : replyPreview.type === 'file' ? (
  <div className="flex items-center gap-2 mt-1">
    <span className="text-lg flex-shrink-0">📄</span>
    <span className="text-xs text-gray-400 truncate italic">{replyPreview.fileName || 'File'}</span>
  </div>
) : (
  <p className="text-xs text-gray-300 truncate">{replyPreview.content}</p>
)}

                    </div>
                  )}

                  {/* Content */}
                  {msg.type === 'image' ? (
                    <img
                      src={msg.content}
                      alt="sent image"
                      // Full width on mobile, capped on desktop
                      className="w-full max-w-[220px] sm:max-w-xs max-h-60 rounded-lg cursor-pointer object-cover mt-1 hover:opacity-90 transition-opacity"
                      onClick={() => setLightboxSrc(msg.content)}
                    />
                  ) : msg.type === 'file' ? (
                    <button
                      type="button"
                      onClick={() => handleDownloadFile(msg.content, getFileDisplayName(msg))}
                      // Full width on mobile, max-w on desktop
                      className="w-full sm:max-w-xs flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 mt-1 rounded-xl bg-[#111B33] border border-white/10 hover:border-[#6C63FF]/50 active:scale-95 transition-all text-left"
                    >
                      <span className="text-xl sm:text-2xl flex-shrink-0">📄</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-[#AFA9FF] font-medium truncate">
                          {getFileDisplayName(msg)}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">Click to download</p>
                      </div>
                    </button>
                  ) : (
                    // Break long words/URLs on mobile so they don't overflow
                    <span className="break-words">{msg.content}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} className="h-4" />
      </div>
    </>
  );
};

export default Message;