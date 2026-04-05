import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useParams, useNavigate } from 'react-router-dom';
import SideBar from '../components/chat/Sidebar';
import Message from '../components/chat/Message';
import Header from '../components/chat/Header';
import MessageInput from '../components/chat/MessageInput';
import ShareModal from '../components/chat/ShareModel';
import CreateRoomModel from '../components/chat/CreateRoomModel';

const Chat = () => {
  const { token } = useAuth();
  const { roomid } = useParams();
  const { groups, messages, fetchChat, joinroom, fetchRooms, fetchUsersInRoom, usersInRoom, privateChats,  activeRoom, setActiveRoom} = useChat();
  const navigate = useNavigate();
  const [createRoom, setCreateRoom] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [groupStep, setGroupStep] = useState(1);
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


  const handleReplyToMessage = (msg) => {
    const senderId = msg?.sender_id?._id || msg?.sender_id;
    const roomUsers = usersInRoom?.[activeRoom?._id] || [];
    const sender = roomUsers.find((u) => u._id === senderId);
    const senderName = msg?.sender_id?.name || sender?.name || 'Unknown';

    setReplyToMessage({
      _id: msg._id,
      content: msg.content,
      senderName
    });
  };

  const handleJoinViaCode = async (inviteCode) => {
    const code = inviteCode?.trim();
    if (!code) return;

    setJoiningViaCode(true);
    try {
      const res = await fetch(`${API_BASE_URL}/invite/${code}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Invalid invite code");
      }

      const data = await res.json();

      await fetchRooms();

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

  return (
    <div className="bg-[#0B1426] h-screen flex text-gray-200 font-sans overflow-hidden">

      {/* SIDEBAR CONTAINER */}
      <SideBar setCreateRoom={setCreateRoom} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}/>
      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col relative bg-[#0B1426]">
        {/* HEADER */}
        <Header share={share} setShare={setShare} setSidebarOpen={setSidebarOpen}/>
        {/* MESSAGES */}
        <Message handleReplyToMessage={handleReplyToMessage} replyToMessage={replyToMessage} setReplyToMessage={setReplyToMessage}/>
        {/* MESSAGE INPUT */}
        {activeRoom && <MessageInput handleReplyToMessage={handleReplyToMessage} replyToMessage={replyToMessage} setReplyToMessage={setReplyToMessage} />
        }
      </div>
      {/* SHARE MODAL */}
      {share && <ShareModal  share={share} setShare={setShare} activeRoom={activeRoom}/>}
      {/* CREATE / JOIN MODAL */}
      {createRoom && <CreateRoomModel setCreateRoom={setCreateRoom} groupStep={groupStep} setGroupStep={setGroupStep} handleJoinViaCode={handleJoinViaCode} joiningViaCode={joiningViaCode} />
      }
    </div>
  );
};

export default Chat;