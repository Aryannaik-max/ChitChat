import React, { useState } from 'react';
import { X, Smile, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const MessageInput = ({ replyToMessage, setReplyToMessage }) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api/v1';
  const { activeRoom, sendMessage } = useChat();
  const [addemoji, setAddemoji] = useState(false);
  const { token } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = React.useRef(null);
  const [newMessage, setNewMessage] = useState('');
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeRoom) return;
    try {
      await sendMessage(activeRoom._id, newMessage, replyToMessage?._id, "text");
      setNewMessage('');
      setReplyToMessage(null);
      setAddemoji(false);
    } catch (err) {
      console.log(err);
    }
  };
 const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setSelectedImage(file);

  if (file.type.startsWith("image/")) {
    setPreview(URL.createObjectURL(file));
  } else {
    setPreview(null);
  }
};

  const clearSelectedFile = () => {
    setSelectedImage(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", selectedImage);

    const res = await fetch(`${BACKEND_URL}/upload`, {
        headers: { Authorization: `Bearer ${token}` },
        method: "POST",
        body: formData,
    });

    const raw = await res.text();
    let data = null;

    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      data = null;
    }

    if (!res.ok) {
      throw new Error(data?.message || "Upload failed");
    }

    const url = data?.data?.fileUrl;
    const isImage = Boolean(data?.data?.isImage);
    const fileName = data?.data?.fileName || selectedImage?.name || "file";

    if (!url) {
      throw new Error("Upload succeeded but file URL is missing");
    }

    return { url, isImage, fileName };
};

const handleSendFile = async () => {
    if (!selectedImage || !activeRoom) return;
    try {
      const { url, isImage, fileName } = await uploadFile();

        await sendMessage(
            activeRoom._id,
            url,
            replyToMessage?._id,
            isImage ? "image" : "file",
        fileName
        );

        clearSelectedFile();
        setReplyToMessage(null);
    } catch (err) {
        console.error(err);
        alert(err.message || "Failed to send file");
    }
};
  return (
    <div className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 bg-gradient-to-t from-[#0B1426] to-transparent">
    {selectedImage && (
  <div className="mx-1.5 mb-1.5 sm:mx-2 sm:mb-2 p-2 bg-[#111B33] rounded-lg">
    {preview ? (
      <img src={preview} className="w-24 sm:w-32 rounded-lg mb-2" />
    ) : (
      <div className="text-gray-300 text-xs sm:text-sm mb-2">
        📄 {selectedImage.name}
      </div>
    )}

    <div className="flex gap-2 ">
      <button
        onClick={handleSendFile}
        className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors"
      >
        Send
      </button>

      <button
        onClick={clearSelectedFile}
        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors"
      >
        Cancel
      </button>
    </div>
  </div>
)}
                <div className="w-full bg-[#1E293B] border border-white/10 rounded-xl sm:rounded-2xl p-1.5 sm:p-2 focus-within:border-[#6C63FF]/50 focus-within:ring-2 sm:focus-within:ring-4 focus-within:ring-[#6C63FF]/10 transition-all shadow-xl">
                {replyToMessage && (
                    <div className="mx-1 mb-1.5 sm:mx-2 sm:mb-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-[#6C63FF]/30 bg-[#111B33] flex items-start justify-between gap-2 sm:gap-3">
                    <div className="min-w-0">
                        <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#9D95FF] font-bold">Replying to {replyToMessage.senderName}</p>
                        <p className="text-xs text-gray-300 truncate">{replyToMessage.content}</p>
                    </div>
                    <button
                        onClick={() => setReplyToMessage(null)}
                        className="flex-shrink-0 text-gray-400 hover:text-white transition-colors mt-0.5"
                        title="Cancel reply"
                    >
                          <X size={14} className="sm:hidden" />
                          <X size={16} className="hidden sm:block" />
                    </button>
                    </div>
                )}
                <div className="flex gap-3 w-full  ">
                  <div
  className='flex justify-center items-center cursor-pointer text-white text-xl'
  onClick={() => fileInputRef.current.click()}
>
  +
</div>
                <input
  type="file"
  accept="*/*"
  ref={fileInputRef}
  onChange={handleImageChange}
  className="hidden"
/>
                <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={replyToMessage ? `Reply to ${replyToMessage.senderName}...` : `Message ${activeRoom.is_group ? '#' + activeRoom.room_name : 'user'}...`}
                    className="flex-1 min-w-0 bg-transparent px-2 sm:px-3 py-2 sm:py-2.5 text-sm sm:text-base text-gray-200 outline-none placeholder-gray-500 font-medium"
                    />
                    <button className='hidden sm:block' onClick={()=>setAddemoji(!addemoji)}>
            <Smile/>
                    </button>
               
           <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 sm:px-5 md:px-7 py-2 sm:py-2.5 bg-[#6C63FF] text-white rounded-lg sm:rounded-xl hover:bg-[#5A52D9] active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed font-semibold shadow-md text-sm sm:text-base"
          >
            <Send size={14} className="sm:hidden" />
            <Send size={19} className="hidden sm:block" />
      
          </button>
                </div>
                    <div className="relative">
  {addemoji && (
    <div className="absolute bottom-14 right-0 z-50">
      <Picker
        data={data}
        onEmojiSelect={(emoji) => {
          setNewMessage((prev) => prev + emoji.native);
        }}
      />
    </div>
  )}
</div>
                </div>
            </div>
    )
}

export default MessageInput;
