import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formateMessageTime } from "../lib/utils";
import { Trash2 } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    deleteSingleMessage, // 🔥 Store se function use kiya
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // State for dropdown menu
  const [menu, setMenu] = useState({
    show: false,
    x: 0,
    y: 0,
    messageId: null,
  });

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 🔥 Message Click Event for Dropdown
  const handleMessageClick = (event, messageId) => {
    event.stopPropagation(); // Prevent parent clicks
    setMenu({
      show: true,
      x: event.pageX,
      y: event.pageY,
      messageId,
    });
  };

  // Click anywhere to close menu
  useEffect(() => {
    const closeMenu = () => setMenu({ ...menu, show: false });
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  // Handle delete message
  const handleDeleteMessage = async (messageId) => {
    // console.log("Deleting message with ID:", messageId, authUser._id); // Debugging
    if (!messageId) {
      alert("Invalid message ID");
      return;
    }
    await deleteSingleMessage(messageId, authUser._id);
  };

  
  if (isMessagesLoading) {
    return (
      <div className="flex w-full flex-col h-full">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[92vh] w-full md:h-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            key={message._id}
            ref={messageEndRef}
            // onClick={(e) => handleMessageClick(e, message._id)} // 🔥 Message Click Event
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header">
              <time className="text-xs opacity-50 ml-1">
                {formateMessageTime(message.createdAt)}
              </time>
            </div>
            <div
              className="chat-bubble cursor-pointer"
              onClick={(e) => handleMessageClick(e, message._id)}>
              {message.image && (
                <img
                  src={message.image}
                  alt="attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />

      {/* Dropdown Menu for Deletion */}
      {menu.show && (
        <div
          className="absolute  shadow-lg rounded-md p-2 text-sm  flex items-center"
          style={{ top: `${menu.y}px`, left: `${menu.x}px` }}>
          <Trash2 />
          <button
            onClick={() => handleDeleteMessage(menu.messageId)}
            className="block w-full  py-2 text-red-600 ">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
