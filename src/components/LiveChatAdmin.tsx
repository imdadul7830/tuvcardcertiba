import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { MessageCircle, Send, User } from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  sender: 'admin' | 'user';
  userId: string;
  text: string;
  timestamp: number;
}

export default function LiveChatAdmin() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io();
    
    newSocket.on('connect', () => {
      newSocket.emit('join-admin');
    });

    newSocket.on('receive-message', (data: Message) => {
      setMessages((prev) => [...prev, data]);
      if (data.sender === 'user' && !activeUserId) {
        setActiveUserId(data.userId); // Auto-select user if none selected
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeUserId]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socket || !activeUserId) return;

    const msg: Message = {
      sender: 'admin',
      userId: activeUserId,
      text: input,
      timestamp: Date.now()
    };
    
    socket.emit('send-message', msg);
    setInput('');
  };

  // Group messages by user
  const userIds = Array.from(new Set(messages.map(m => m.userId)));
  const activeMessages = messages.filter(m => m.userId === activeUserId);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex h-[600px] overflow-hidden">
      {/* Users List Sidebar */}
      <div className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <MessageCircle size={18} className="text-blue-600" />
            Active Chats
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {userIds.length === 0 ? (
            <p className="p-4 text-sm text-gray-500 text-center">No active chats</p>
          ) : (
            userIds.map(id => (
              <button
                key={id}
                onClick={() => setActiveUserId(id)}
                className={`w-full text-left p-4 border-b border-gray-200 flex items-center gap-3 transition-colors ${activeUserId === id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-100 border-l-4 border-l-transparent'}`}
              >
                <div className="bg-blue-100 text-blue-700 p-2 rounded-full">
                  <User size={16} />
                </div>
                <div className="flex-1 truncate">
                  <p className="text-sm font-medium text-gray-900">User {id}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {activeUserId ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-3">
              <div className="bg-blue-100 text-blue-700 p-2 rounded-full">
                <User size={20} />
              </div>
              <h3 className="font-bold text-gray-900">Chat with User {activeUserId}</h3>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50 flex flex-col gap-4">
              {activeMessages.map((msg, idx) => {
                const isMe = msg.sender === 'admin';
                return (
                  <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-lg shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'}`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-[10px] mt-1 text-right ${isMe ? 'opacity-70' : 'text-gray-500'}`}>
                        {format(msg.timestamp, 'HH:mm')}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-200 flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your reply..."
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2 font-medium"
              >
                <Send size={18} />
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50 flex-col gap-3">
            <MessageCircle size={48} className="text-gray-300" />
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
