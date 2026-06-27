import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { MessageCircle, X, Send, Bot, User, Globe } from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  sender: 'admin' | 'user' | 'bot';
  userId: string;
  text: string;
  timestamp: number;
}

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatState, setChatState] = useState<'idle' | 'language_selection' | 'active'>('idle');
  const [language, setLanguage] = useState<'en' | 'hi' | null>(null);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userId] = useState(() => {
    let id = localStorage.getItem('chatUserId');
    if (!id) {
      id = Math.random().toString(36).substring(2, 9);
      localStorage.setItem('chatUserId', id);
    }
    return id;
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only connect when opened for the first time
    if (!isOpen) return;

    if (chatState === 'idle') {
      setChatState('language_selection');
      setMessages([
        {
          sender: 'bot',
          userId: 'bot',
          text: 'Welcome to Certiva TUV Live Support! 👋\nकृपया अपनी पसंदीदा भाषा चुनें / Please select your preferred language:',
          timestamp: Date.now()
        }
      ]);
    }

    if (!socket) {
      const newSocket = io();
      
      newSocket.on('connect', () => {
        newSocket.emit('join-user', userId);
      });

      newSocket.on('receive-message', (data: Message) => {
        setMessages((prev) => [...prev, data]);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isOpen, chatState, userId, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, chatState]);

  const handleLanguageSelect = (lang: 'en' | 'hi') => {
    setLanguage(lang);
    setChatState('active');
    
    setMessages(prev => [
      ...prev,
      {
        sender: 'user',
        userId,
        text: lang === 'en' ? 'English' : 'हिन्दी',
        timestamp: Date.now()
      },
      {
        sender: 'bot',
        userId: 'bot',
        text: lang === 'en' 
          ? 'Thank you! An agent will be with you shortly. How can we help you today?' 
          : 'धन्यवाद! एक एजेंट जल्द ही आपसे जुड़ेगा। आज हम आपकी कैसे मदद कर सकते हैं?',
        timestamp: Date.now()
      }
    ]);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socket || chatState !== 'active') return;

    const msg: Message = {
      sender: 'user',
      userId,
      text: input,
      timestamp: Date.now()
    };
    
    socket.emit('send-message', msg);
    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col overflow-hidden border border-gray-100 transform transition-all duration-300 ease-out scale-100 opacity-100" style={{ height: '550px', maxHeight: '85vh' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-[#002f6c] to-[#0047a5] text-white p-4 flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="bg-white/20 p-2 rounded-full">
                  <Bot size={22} className="text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-[#002f6c] rounded-full"></span>
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">Certiva Support</h3>
                <p className="text-xs text-blue-100 font-medium">We usually reply in a few minutes</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors focus:outline-none">
              <X size={20} />
            </button>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-[#f8fafc] flex flex-col gap-4">
            <div className="text-center my-2">
              <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider bg-gray-100 px-3 py-1 rounded-full">Today</span>
            </div>
            
            {messages.map((msg, idx) => {
              const isMe = msg.sender === 'user';
              const isBot = msg.sender === 'bot';
              
              return (
                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} transition-opacity duration-300`}>
                  {!isMe && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 flex-shrink-0 border border-blue-200">
                      {isBot ? <Bot size={16} className="text-blue-700" /> : <User size={16} className="text-blue-700" />}
                    </div>
                  )}
                  <div className={`max-w-[75%] px-4 py-2.5 shadow-sm flex flex-col ${
                    isMe 
                      ? 'bg-[#002f6c] text-white rounded-2xl rounded-tr-sm' 
                      : 'bg-white text-gray-800 rounded-2xl rounded-tl-sm border border-gray-100'
                  }`}>
                    <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <p className={`text-[10px] mt-1.5 font-medium ${isMe ? 'text-blue-200 text-right' : 'text-gray-400 text-left'}`}>
                      {format(msg.timestamp, 'HH:mm')}
                    </p>
                  </div>
                </div>
              );
            })}
            
            {/* Language Selection Buttons */}
            {chatState === 'language_selection' && (
              <div className="flex flex-col gap-2 ml-10 max-w-[75%] transition-opacity duration-500">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Globe size={12}/> Select Language:</p>
                <button 
                  onClick={() => handleLanguageSelect('hi')}
                  className="bg-white border border-[#002f6c] text-[#002f6c] hover:bg-blue-50 py-2 px-4 rounded-xl text-sm font-medium transition-colors shadow-sm text-center"
                >
                  हिन्दी (Hindi)
                </button>
                <button 
                  onClick={() => handleLanguageSelect('en')}
                  className="bg-white border border-[#002f6c] text-[#002f6c] hover:bg-blue-50 py-2 px-4 rounded-xl text-sm font-medium transition-colors shadow-sm text-center"
                >
                  English
                </button>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100">
            <form onSubmit={sendMessage} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={chatState !== 'active'}
                placeholder={chatState === 'active' ? (language === 'hi' ? "यहां टाइप करें..." : "Type your message...") : "Select a language first..."}
                className="flex-1 w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#002f6c] transition-all text-sm disabled:opacity-60 disabled:bg-gray-100"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || chatState !== 'active'} 
                className="absolute right-2 p-2 bg-[#002f6c] text-white rounded-full hover:bg-[#002250] disabled:opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} className={input.trim() && chatState === 'active' ? 'translate-x-[1px] translate-y-[-1px]' : ''} />
              </button>
            </form>
            <div className="text-center mt-2">
              <span className="text-[10px] text-gray-400 font-medium">Powered by Certiva</span>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#002f6c] hover:bg-[#002250] text-white rounded-full p-4 shadow-xl shadow-blue-900/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none flex items-center justify-center"
        >
          <MessageCircle size={28} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>
      )}
    </div>
  );
}
