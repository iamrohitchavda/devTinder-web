import { useParams, Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { createSocketConnection } from "../../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_BASE_URL } from "../../utils/constants";

const Chat = () => {
  const { toUserId } = useParams();
  const location = useLocation();
  const receiverName = location.state?.receiverName || "Unknown";

  const user = useSelector((store) => store.user);
  // Simulated initial chat state.
  // In reality, you will fetch these from your backend via Socket.io / API.
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);
  const chatContainerRef = useRef(null);
  const [isUserActive, setIsUserActive] = useState(false);

  const fromUserId = user?.data?._id;

  useEffect(() => {
    const fetchChatMessages = async () => {
      let chat = {};
      try {
        chat = await axios.get(`${API_BASE_URL}/chat/${toUserId}`, {
          withCredentials: true,
        });
        setError(null);
      } catch (err) {
        if (err.response?.status === 500) {
          setError("Can't connect to server. Please try again later.");
        } else if (err.response?.status === 403) {
          setError(
            err.response?.data?.message || "You cannot message this user.",
          );
        } else {
          setError("Something went wrong. Please try again later.");
        }
      }
      if (chat?.data?.data?.messages) {
        const chatMessages = chat.data.data.messages.map((msg) => {
          return {
            senderId: msg.senderId?._id || msg.senderId,
            senderName: msg.senderId?.firstName
              ? `${msg.senderId.firstName} ${msg.senderId.lastName}`
              : "Unknown",
            text: msg.text,
            createdAt: msg.createdAt,
          };
        });
        setMessages(chatMessages);
      }
    };
    fetchChatMessages();
  }, [toUserId]);

  useEffect(() => {
    if (!fromUserId || !toUserId) return;
    const socket = createSocketConnection();
    // As soon as the page loads, the socket connection is made, and joinChat event is emitted

    socket.emit("joinChat", { receiverId: toUserId });

    socket.on(
      "messageReceived",
      ({ _id, text, senderId, receiverId, createdAt, senderName }) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { _id, text, senderId, receiverId, createdAt, senderName },
        ]);
      },
    );

    // Listen for other users' status changes
    socket.on("status-changed", ({ userOnlineList }) => {
      if (userOnlineList[toUserId]) {
        setIsUserActive(true);
      } else {
        setIsUserActive(false);
      }
    });

    socket.on("chat-error", ({ message }) => setError(message));

    // When the component unmounts or user navigates away, cleanly remove the listeners
    // instead of destroying the entire physical TCP connection.
    return () => {
      console.log("leaving chat component. cleaning listeners...");
      socket.off("messageReceived");
      socket.off("status-changed");
      socket.off("chat-error");
    };
  }, [fromUserId, toUserId]);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current?.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const socket = createSocketConnection();

    socket.emit("sendMessage", {
      text: newMessage,
      receiverId: toUserId,
    });

    setNewMessage("");
  };

  return (
    <div className="container mx-auto max-w-5xl px-0 sm:px-4 py-0 sm:py-8 h-[calc(100vh-64px)] sm:h-[calc(100vh-120px)] animate-fade-in flex flex-col">
      <div className="flex-1 flex flex-col modern-card border-x-0 sm:border-x sm:rounded-3xl bg-base-100 shadow-2xl overflow-hidden relative">
        {/* Chat Header */}
        <div className="glass-nav z-10 px-6 py-4 flex items-center justify-between border-b border-base-200 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <Link
              to="/connections"
              className="btn btn-ghost btn-circle btn-sm mr-2 hover:bg-base-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <div className="relative indicator">
              <span
                className={`indicator-item border-white absolute bottom-1 right-1 ${isUserActive ? "badge badge-success badge-xs" : "badge-error"}`}
              ></span>
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-base-200 bg-base-300">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  alt="Connection Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-extrabold text-base-content leading-tight">
                {receiverName}
              </h2>
              <span className="text-xs font-semibold text-success tracking-wide">
                {isUserActive ? "Active now" : "Offline"}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="btn btn-ghost btn-circle text-base-content/70 hover:text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </button>
            <button className="btn btn-ghost btn-circle text-base-content/70 hover:text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 bg-base-200/50 space-y-4"
        >
          <div className="text-center my-6">
            <span className="text-xs font-semibold px-3 py-1 bg-base-200 text-base-content/50 rounded-full shadow-sm">
              Today
            </span>
          </div>

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat ${msg.senderId === fromUserId ? "chat-end" : "chat-start"} animate-slide-up`}
            >
              {msg.senderId !== fromUserId ? (
                <div className="chat-image avatar hidden sm:block">
                  <div className="w-10 rounded-full">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                      alt="Avatar"
                    />
                  </div>
                </div>
              ) : (
                <div className="chat-image avatar hidden sm:block">
                  <div className="w-10 rounded-full">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                      alt="Avatar"
                    />
                  </div>
                </div>
              )}
              <div className="chat-header mb-1 text-xs opacity-60">
                {msg.senderId === fromUserId
                  ? "You"
                  : msg.senderName
                    ? msg.senderName
                    : "Unknown"}
                <time className="text-xs opacity-50 ml-2">
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </time>
              </div>
              <div
                className={`chat-bubble shadow-sm ${
                  msg.senderId === fromUserId
                    ? "bg-primary text-primary-content"
                    : "bg-base-100 text-base-content border border-base-200"
                }`}
              >
                {msg.text}
              </div>
              {msg.senderId === fromUserId && (
                <div className="chat-footer opacity-50 text-xs mt-1">
                  Delivered
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Message Input Compositor */}
        <div className="bg-base-100 p-4 border-t border-base-200 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] shrink-0 z-10 flex items-center justify-center min-h-[76px]">
          {error ? (
            <div className="text-center py-2 text-base-content/50 font-medium tracking-wide">
              {error}
            </div>
          ) : (
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-2 max-w-full w-full"
            >
              <button
                type="button"
                className="btn btn-circle btn-ghost text-base-content/50 hover:text-primary transition-colors shrink-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              </button>
              <input
                type="text"
                placeholder="Type your message..."
                className="input input-bordered w-full rounded-full bg-base-200/50 focus:bg-base-100 focus:border-primary transition-all shadow-inner"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-circle btn-primary shadow-lg shadow-primary/30 hover:scale-105 transition-transform shrink-0"
                disabled={!newMessage.trim()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 rotate-90"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
