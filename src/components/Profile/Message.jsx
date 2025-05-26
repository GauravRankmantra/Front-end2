import React, { useEffect, useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import axios from "axios";

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [activeUserId, setActiveUserId] = useState("");
  const backendUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      setActiveUserId(user._id);
    } else {
      console.error("User not found or _id missing in localStorage");
    }
  }, []);

  useEffect(() => {
    if (activeUserId) {
      fetchMessages();
    }
  }, [activeUserId]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${backendUrl}api/v1/message/messages/${activeUserId}`);
      const data = res.data;
      setMessages(Array.isArray(data.messages) ? data.messages : []);
    } catch (err) {
      console.error("Failed to fetch messages", err);
      setMessages([]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    try {
      await axios.post(`${backendUrl}api/v1/message/messages/user`, {
        userId: activeUserId,
        text: inputMessage,
      });
      setInputMessage("");
      fetchMessages(); // Re-fetch messages to ensure sync
    } catch (err) {
      console.error("Message send failed", err);
    }
  };

  return (
    <div className="mt-10 text-white mx-auto px-4">
      <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 text-white py-4 px-8 rounded-lg shadow-md mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <FaEnvelope className="lg:text-2xl text-lg animate-pulse" />
          <h1 className="md:text-2xl text-lg font-semibold tracking-tight">
            Support Chat
          </h1>
        </div>
        <button className="bg-white text-cyan-500 font-semibold md:py-2 text-sm py-1 px-2 md:px-4 rounded-full hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition duration-300 ease-in-out">
          Chat With Admin
        </button>
      </div>

      <div className="flex h-[calc(100vh-160px)] bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-800">
        <div className="flex-1 flex flex-col bg-gray-800">
          <div className="px-6 py-4 border-b border-gray-700 text-white font-semibold text-lg">
            Chat
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {Array.isArray(messages) && messages.length > 0 ? (
              messages.map((msg, idx) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={idx}
                    className={`flex items-end space-x-3 ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isUser && (
                      <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
                        A
                      </div>
                    )}
                    <div
                      className={`relative p-3 rounded-2xl max-w-xs shadow-md text-sm leading-relaxed ${
                        isUser
                          ? "bg-blue-600 text-white text-right bubble-tail-right"
                          : "bg-gray-700 text-white bubble-tail-left"
                      }`}
                    >
                      {msg.text}
                    </div>
                    {isUser && (
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        U
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400">No messages yet.</p>
            )}
          </div>

          <div className="border-t border-gray-700 p-4 bg-gray-850">
            <form
              className="flex items-center space-x-3"
              onSubmit={handleSendMessage}
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-gray-700 text-white placeholder-gray-400 px-4 py-2 rounded-full focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Type your message..."
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-transform transform hover:scale-110"
              >
                <FiSend className="text-xl animate-bounce" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bubble Tail Styling */}
      <style>{`
        .bubble-tail-left::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: -8px;
          width: 0;
          height: 0;
          border: 8px solid transparent;
          border-top-color: #374151;
          border-left: 0;
          border-bottom: 0;
        }
        .bubble-tail-right::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: -8px;
          width: 0;
          height: 0;
          border: 8px solid transparent;
          border-top-color: #2563eb;
          border-right: 0;
          border-bottom: 0;
        }
      `}</style>
    </div>
  );
};

export default Message;
