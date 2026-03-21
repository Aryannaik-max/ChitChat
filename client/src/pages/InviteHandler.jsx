import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

const InviteHandler = () => {
  const { token } = useParams();
  const { user, authToken } = useAuth();
  const { fetchRooms } = useChat();
  const navigate = useNavigate();
  const hasFired = useRef(false);
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!token) return;
    if (hasFired.current) return;

    // 🔧 KEY FIX: don't rely solely on context state — read directly from
    // localStorage as a fallback. Context may never hydrate authToken if it's
    // stored under a different key, or if AuthContext doesn't expose it.
    const resolvedToken =
      authToken ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("jwt");

    // Not logged in at all
    if (!user && !resolvedToken) {
      localStorage.setItem("pendingInviteToken", token);
      navigate("/signup");
      return;
    }

    if (!resolvedToken) {
      // Still no token — log so you can see what key it's actually stored under
      console.warn(
        "[InviteHandler] No auth token found. localStorage keys:",
        Object.keys(localStorage)
      );
      return;
    }

    hasFired.current = true;
    handleJoin(resolvedToken);
  }, [user, authToken, token]);

  const handleJoin = async (resolvedToken) => {
    try {
      const res = await fetch(`${API_BASE_URL}/invite/${token}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resolvedToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to join");
      }

      const data = await res.json();
      await fetchRooms();
      navigate(`/chat/${data.data._id}`);
    } catch (err) {
      console.error(err);
      alert("Invalid or expired invite link");
      navigate("/chat");
    }
  };

  return (
    <div className="bg-[#0B1530] h-screen flex items-center justify-center">
      <p className="text-gray-400 text-sm">Joining group...</p>
    </div>
  );
};

export default InviteHandler;