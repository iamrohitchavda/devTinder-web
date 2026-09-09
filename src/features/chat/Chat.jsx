import { useParams, Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { createSocketConnection } from "../../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_BASE_URL, DEFAULT_PROFILE_PHOTO } from "../../utils/constants";

const QUICK_EMOJIS = ["👍", "❤️", "😂", "🎉", "🚀", "🔥", "👏", "👀"];

const Chat = () => {
  const { toUserId } = useParams();
  const location = useLocation();
  const [partner, setPartner] = useState(location.state?.receiver || null);

  const user = useSelector((store) => store.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);
  const chatContainerRef = useRef(null);
  const photoInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [isUserActive, setIsUserActive] = useState(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [isGifComposerOpen, setIsGifComposerOpen] = useState(false);
  const [gifUrl, setGifUrl] = useState("");

  const fromUserId = user?.data?._id;
  const receiverName = partner
    ? `${partner.firstName} ${partner.lastName || ""}`.trim()
    : location.state?.receiverName || "Unknown";
  const receiverPhoto = partner?.photoUrl || DEFAULT_PROFILE_PHOTO;
  const currentUserPhoto = user?.data?.photoUrl || DEFAULT_PROFILE_PHOTO;

  useEffect(() => {
    const fetchChatMessages = async () => {
      let chat = {};
      try {
        chat = await axios.get(`${API_BASE_URL}/chat/${toUserId}`, {
          withCredentials: true,
        });
        setPartner(chat.data.data.partner);
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
            _id: msg._id,
            senderId: msg.senderId?._id || msg.senderId,
            senderName: msg.senderId?.firstName
              ? `${msg.senderId.firstName} ${msg.senderId.lastName}`
              : "Unknown",
            text: msg.text,
            imageData: msg.imageData,
            mediaUrl: msg.mediaUrl,
            readAt: msg.readAt,
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
      ({
        _id,
        text,
        imageData,
        mediaUrl,
        senderId,
        receiverId,
        createdAt,
        senderName,
      }) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            _id,
            text,
            imageData,
            mediaUrl,
            senderId,
            receiverId,
            createdAt,
            senderName,
          },
        ]);
      },
    );

    socket.on("messageUnsent", ({ messageId }) => {
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== messageId),
      );
    });

    socket.on("typingStarted", ({ senderId }) => {
      if (senderId === toUserId) setIsPartnerTyping(true);
    });

    socket.on("typingStopped", ({ senderId }) => {
      if (senderId === toUserId) setIsPartnerTyping(false);
    });

    socket.on("messagesRead", ({ messageIds, readAt }) => {
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          messageIds.includes(message._id) ? { ...message, readAt } : message,
        ),
      );
    });

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
      clearTimeout(typingTimeoutRef.current);
      socket.emit("typingStop", { receiverId: toUserId });
      console.log("leaving chat component. cleaning listeners...");
      socket.off("messageReceived");
      socket.off("messageUnsent");
      socket.off("typingStarted");
      socket.off("typingStopped");
      socket.off("messagesRead");
      socket.off("status-changed");
      socket.off("chat-error");
    };
  }, [fromUserId, toUserId]);

  useEffect(() => {
    const hasUnreadMessages = messages.some(
      (message) => message.senderId === toUserId && !message.readAt,
    );

    if (hasUnreadMessages) {
      createSocketConnection().emit("markMessagesRead", {
        receiverId: toUserId,
      });
    }
  }, [messages, toUserId]);

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

    socket.emit("typingStop", { receiverId: toUserId });
    setNewMessage("");
  };

  const handleMessageChange = (value) => {
    setNewMessage(value);
    const socket = createSocketConnection();

    if (!value.trim()) {
      socket.emit("typingStop", { receiverId: toUserId });
      clearTimeout(typingTimeoutRef.current);
      return;
    }

    socket.emit("typingStart", { receiverId: toUserId });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typingStop", { receiverId: toUserId });
    }, 1200);
  };

  const handleEmojiSelect = (emoji) => {
    handleMessageChange(`${newMessage}${emoji}`);
  };

  const handleSendGif = (event) => {
    event.preventDefault();
    if (!gifUrl.trim()) return;

    createSocketConnection().emit("sendMessage", {
      mediaUrl: gifUrl.trim(),
      receiverId: toUserId,
    });
    setGifUrl("");
    setIsGifComposerOpen(false);
  };

  const handlePhotoSelection = (event) => {
    const [file] = event.target.files;
    event.target.value = "";

    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 1500000) {
      setError("Choose an image smaller than 1.5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      createSocketConnection().emit("sendMessage", {
        imageData: reader.result,
        receiverId: toUserId,
      });
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleClearChat = async () => {
    if (
      !window.confirm(
        "Delete this conversation for you? The other person will still have it.",
      )
    ) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/chat/${toUserId}`, {
        withCredentials: true,
      });
      setMessages([]);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete this chat.");
    }
  };

  const handleUnsendMessage = async (messageId) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/chat/${toUserId}/messages/${messageId}`,
        {
          withCredentials: true,
        },
      );
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== messageId),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Unable to unsend this message.");
    }
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
                  src={receiverPhoto}
                  alt={receiverName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-extrabold text-base-content leading-tight">
                {receiverName}
              </h2>
              <span className="text-xs font-semibold text-success tracking-wide">
                {isPartnerTyping
                  ? "typing..."
                  : isUserActive
                    ? "Active now"
                    : "Offline"}
              </span>
            </div>
          </div>

          <div className="dropdown dropdown-end">
            <button
              type="button"
              tabIndex={0}
              aria-label="Chat options"
              className="btn btn-ghost btn-circle text-base-content/70 hover:text-primary"
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
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu z-20 mt-3 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl"
            >
              <li>
                <button
                  type="button"
                  onClick={handleClearChat}
                  className="text-error"
                >
                  Delete chat for me
                </button>
              </li>
            </ul>
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

          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`chat ${msg.senderId === fromUserId ? "chat-end" : "chat-start"} animate-slide-up`}
            >
              <div className="chat-image avatar hidden sm:block">
                <div className="w-10 rounded-full">
                  <img
                    src={
                      msg.senderId === fromUserId
                        ? currentUserPhoto
                        : receiverPhoto
                    }
                    alt={
                      msg.senderId === fromUserId
                        ? "Your profile"
                        : receiverName
                    }
                  />
                </div>
              </div>
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
                {(msg.imageData || msg.mediaUrl) && (
                  <img
                    src={msg.imageData || msg.mediaUrl}
                    alt="Shared in chat"
                    className="mb-2 max-h-72 max-w-full rounded-xl object-cover"
                  />
                )}
                {msg.text}
              </div>
              {msg.senderId === fromUserId && (
                <div className="chat-footer mt-1 flex items-center justify-end gap-2 text-xs opacity-60">
                  <span>{msg.readAt ? "Seen" : "Delivered"}</span>
                  <button
                    type="button"
                    onClick={() => handleUnsendMessage(msg._id)}
                    className="hover:text-error"
                  >
                    Unsend
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Message Input Compositor */}
        <div className="relative bg-base-100 p-4 border-t border-base-200 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] shrink-0 z-10 flex items-center justify-center min-h-[76px]">
          {isGifComposerOpen && (
            <form
              onSubmit={handleSendGif}
              className="absolute bottom-full left-4 right-4 mb-2 flex gap-2 rounded-2xl border border-base-300 bg-base-100 p-3 shadow-xl"
            >
              <input
                type="url"
                autoFocus
                value={gifUrl}
                onChange={(event) => setGifUrl(event.target.value)}
                placeholder="Paste a GIF URL..."
                className="input input-sm input-bordered grow"
              />
              <button type="submit" className="btn btn-sm btn-primary">
                Send GIF
              </button>
            </form>
          )}
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 max-w-full w-full"
          >
            <input
              ref={photoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handlePhotoSelection}
            />
            <button
              type="button"
              aria-label="Send a photo"
              onClick={() => photoInputRef.current?.click()}
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
            <div className="dropdown dropdown-top">
              <button
                type="button"
                tabIndex={0}
                aria-label="Choose an emoji"
                className="btn btn-circle btn-ghost text-base-content/50 hover:text-primary"
              >
                ☺
              </button>
              <div
                tabIndex={0}
                className="dropdown-content z-20 mb-3 grid w-56 grid-cols-4 gap-1 rounded-2xl border border-base-300 bg-base-100 p-2 shadow-xl"
              >
                {QUICK_EMOJIS.map((emoji) => (
                  <button
                    type="button"
                    key={emoji}
                    onClick={() => handleEmojiSelect(emoji)}
                    className="btn btn-ghost btn-sm text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsGifComposerOpen((isOpen) => !isOpen)}
              className="btn btn-ghost btn-sm px-2 text-xs font-bold text-base-content/60 hover:text-primary"
            >
              GIF
            </button>
            <input
              type="text"
              placeholder="Type your message..."
              className="input input-bordered w-full rounded-full bg-base-200/50 focus:bg-base-100 focus:border-primary transition-all shadow-inner"
              value={newMessage}
              onChange={(event) => handleMessageChange(event.target.value)}
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
          {error && (
            <p className="absolute -top-7 text-xs text-error">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
