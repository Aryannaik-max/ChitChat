import { useContext, createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { io } from "socket.io-client";
import { useRef } from "react";

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api/v1").replace(/\/+$/, "");
const getSocketUrl = (apiUrl) => {
  if (!apiUrl) return apiUrl;
  try {
    const parsed = new URL(apiUrl);
    return `${parsed.protocol}//${parsed.host}`;
  } catch (error) {
    return apiUrl;
  }
};
const SOCKET_URL = getSocketUrl(API_BASE_URL);

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  
  return context;
};

export const ChatProvider = ({ children }) => {
  
  const { token, user } = useAuth();
  const socketRef = useRef(null);

  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState({});
  const [usersInRoom, setUsersInRoom] = useState({});
  const [DMUsers, setDMUsers] = useState({})

  const fetchRooms = useCallback(async () => {

    if (!token || !user) return;

    try {

      const response = await axios.get(
        `${API_BASE_URL}/participants/rooms/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setRooms(response.data.data);
      }

      return response.data;

    } catch (error) {
      console.log("Error fetching rooms:", error);
      throw error;
    }

  }, [token, user]);

  useEffect(() => {

    const initChat = async () => {
      if (token) {
        await fetchRooms();
      }
    };

    initChat();

  }, [fetchRooms, token]);

  useEffect(() => {
    if (!token) return;

    socketRef.current = io(SOCKET_URL, {
      auth: {
        token: `Bearer ${token}`
      },
      transports: ["websocket", "polling"]
    });

    socketRef.current.on('connect', () => {
      console.log("Connected to chat server");
    })

    socketRef.current.on('connect_error', (error) => {
      console.log("Socket connection error:", error?.message || error);
    });

    socketRef.current.on('receive-message', (data) => {
      const normalizedMessage = {
        _id: data._id || `${Date.now()}-${Math.random()}`,
        room_id: data.room_id || data.roomId,
        sender_id: data.sender_id || data.senderId,
        content: data.content || data.message,
        createdAt: data.createdAt || data.timestamp || new Date().toISOString()
      };

      setMessages(prev => ({
        ...prev, 
        [normalizedMessage.room_id]: [
          ...(prev[normalizedMessage.room_id] || []),
          normalizedMessage
        ]
      }));
      console.log("Received message:", data);
    });

    return () => {
      socketRef.current.disconnect();
      console.log("Disconnected from chat server");
    }
  }, [token]);

  const groups = rooms.filter(room => room.is_group);
  const privateChats = rooms.filter(room => !room.is_group);

  const fetchChat = useCallback(async (roomId) => {

    if (!token) return;

    try {

      const response = await axios.get(
        `${API_BASE_URL}/message/room/${roomId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {

        setMessages(prev => ({
          ...prev,
          [roomId]: response.data.data
        }));

      }

      return response.data;

    } catch (error) {
      console.log("Error fetching chat messages:", error);
      throw error;
    }

  }, [token]);

  const fetchUsersInRoom = useCallback(async (roomId) => {
    if (!token) return;
    try {
      const response = await axios.get(
        `${API_BASE_URL}/participants/users/${roomId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      )
      if (response.data.success) {
        setUsersInRoom(prev => ({
          ...prev, 
          [roomId]: response.data.data
        }));
      }
    } catch (error) {
        console.log("Error fetching users in room:", error);
        throw error;
    }
  }, [token]);

  const sendMessage = useCallback((roomId, content, senderId) => {
    if (!socketRef.current) {
      throw new Error("Socket is not connected");
    }

    const message = content?.trim();
    if (!roomId || !senderId || !message) {
      throw new Error("roomId, senderId and message are required");
    }

    return new Promise((resolve, reject) => {
      socketRef.current.emit(
        "send-message",
        {
          roomId,
          message,
          senderId
        },
        (ack) => {
          if (ack?.success) {
            resolve(ack.data);
            return;
          }
          reject(new Error(ack?.message || "Failed to send message"));
        }
      );
    });
  }, []);

  const createGroup = useCallback(async (nameOrPayload, userIdParam) => {
    if(!token) return;

    const roomName =
      typeof nameOrPayload === 'string'
        ? nameOrPayload
        : nameOrPayload?.room_name;

    const adminId =
      userIdParam || nameOrPayload?.admin_id || nameOrPayload?.creator_id || user?._id;

    if (!roomName || !roomName.trim()) {
      throw new Error('room_name is required to create a room');
    }

    const groupData = {
      room_name: roomName.trim(),
      admin_id: adminId,
      is_group: true
    };
    try {
        const response = await axios.post(`${API_BASE_URL}/group`, groupData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // if(response.data.success) {
        //     const createdRoomId = response.data?.data?._id;
        //     const creatorId = adminId || user?._id;

        //     if (createdRoomId && creatorId) {
        //       await axios.post(
        //         `${BACKEND_URL}/participants`,
        //         {
        //           room_id: createdRoomId,
        //           user_id: creatorId
        //         },
        //         {
        //           headers: {
        //             Authorization: `Bearer ${token}`
        //           }
        //         }
        //       );
        //     }

        // }
        await fetchRooms();
        return response.data;
    } catch (error) {
        console.log("Error creating group:", error);
        throw error;
    }
  }, [fetchRooms, token, user]);

  const startDM = useCallback(async (otherUserId) => {
      if (!token || !user?._id) return;

      try {
        const response = await axios.post(
          `${API_BASE_URL}/dm`,
          {
            userId1: user._id,
            userId2: otherUserId
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        await fetchRooms();

        return response.data.data; // room
      } catch (error) {
        console.log("Error starting DM:", error);
        throw error;
      }
    }, [token, user, fetchRooms]);
  const joinroom = useCallback((roomId) => {
    if(!socketRef.current) return;
    if (!user?._id || !roomId) return;

    socketRef.current.emit("join-room", {
      roomId,
      userId: user._id
    });
  }, [user]);

  const values = {
  rooms,
  groups,
  privateChats,
  usersInRoom,
  messages,
  fetchChat,
  fetchRooms,
  sendMessage,
  createGroup,
  joinroom ,
  fetchUsersInRoom,
  startDM
};

  return (
    <ChatContext.Provider value={values}>
      {children}
    </ChatContext.Provider>
  );
};