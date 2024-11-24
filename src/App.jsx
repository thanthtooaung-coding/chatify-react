import React, { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ServerList } from './components/ServerList';
import { ChannelList } from './components/ChannelList';
import { ChatMessage } from './components/ChatMessage';
import { Hash, Send, PlusCircle, AtSign, Smile, Gift, Menu } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [username, setUsername] = useState('');
    const [isUsernameSet, setIsUsernameSet] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const socketRef = useRef(null);
    const userID = useRef(uuidv4());
    const messageTimestamps = useRef(new Set());
    const messagesEndRef = useRef(null);
    const emojiPickerRef = useRef(null);

    useEffect(() => {
        socketRef.current = new WebSocket('wss://chatify-go.onrender.com/ws');

        socketRef.current.onopen = () => {
            setIsConnected(true);
        };

        socketRef.current.onmessage = (event) => {
            const parsedMessage = JSON.parse(event.data);
            if (!messageTimestamps.current.has(parsedMessage.timestamp)) {
                setMessages((prev) => [...prev, parsedMessage]);
                messageTimestamps.current.add(parsedMessage.timestamp);
            }
        };

        socketRef.current.onclose = () => {
            setIsConnected(false);
            console.log("WebSocket connection closed");
        };

        socketRef.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.close();
            }
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSetUsername = () => {
        if (username.trim() !== "") {
            setIsUsernameSet(true);
        }
    };

    const sendMessage = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && input && isUsernameSet) {
            const messageObject = {
                userID: userID.current,
                username: username,
                content: input,
                timestamp: new Date().toISOString(),
            };

            socketRef.current.send(JSON.stringify(messageObject));

            if (!messageTimestamps.current.has(messageObject.timestamp)) {
                setMessages((prev) => [...prev, messageObject]);
                messageTimestamps.current.add(messageObject.timestamp);
            }

            setInput('');
        }
    };

    const handleEmojiClick = (emojiObject) => {
        setInput((prevInput) => prevInput + emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    if (!isUsernameSet) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
                    <h1 className="text-2xl font-bold text-white mb-4">Welcome to Enhanced Discord-like Chat</h1>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 mb-4 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        onClick={handleSetUsername}
                        className="w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded hover:bg-indigo-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                    >
                        Set Username
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
            {/* Backdrop for mobile sidebar */}
            <div 
                className={`fixed inset-0 bg-black/50 z-30 transition-opacity duration-200 lg:hidden ${
                    showSidebar ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`} 
                onClick={() => setShowSidebar(false)}
            />
            
            {/* Server and Channel Lists Container */}
            <div 
                className={`fixed inset-y-0 left-0 z-40 flex lg:relative lg:translate-x-0 transition-transform duration-200 ease-out ${
                    showSidebar ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <ServerList />
                <ChannelList username={username} onClose={() => setShowSidebar(false)} />
            </div>
            
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Chat Header */}
                <div className="h-12 min-h-[48px] bg-gray-800 border-b border-gray-900 flex items-center px-4 lg:px-4">
                    <button 
                        className="mr-4 text-gray-200 lg:hidden" 
                        onClick={() => setShowSidebar(true)}
                    >
                        <Menu size={20} />
                    </button>
                    <div className="flex items-center flex-1 min-w-0">
                        <Hash size={20} className="text-gray-400 mr-2" />
                        <h2 className="text-white font-semibold truncate">general</h2>
                    </div>
                    <div className="flex items-center space-x-3">
                        <AtSign size={20} className="text-gray-400 hover:text-white cursor-pointer hidden lg:block" />
                        <PlusCircle size={20} className="text-gray-400 hover:text-white cursor-pointer" />
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                    <div className="p-4 space-y-4">
                        {messages.map((message, index) => (
                            <ChatMessage
                                key={index}
                                message={message}
                                isCurrentUser={message.userID === userID.current}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Chat Input */}
                <div className="p-4 bg-gray-800">
                    <div className="flex items-center bg-gray-700 rounded-lg relative">
                        <button className="p-3 text-gray-400 hover:text-white">
                            <PlusCircle size={20} />
                        </button>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Message #general"
                            className="flex-1 bg-transparent px-2 py-2 text-white focus:outline-none min-w-0"
                        />
                        <div className="flex items-center px-2">
                            <button className="p-2 text-gray-400 hover:text-white hidden sm:block">
                                <Gift size={20} />
                            </button>
                            <button
                                className="p-2 text-gray-400 hover:text-white"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            >
                                <Smile size={20} />
                            </button>
                            <button
                            onClick={sendMessage}
                            className="p-2 text-gray-400 hover:text-white"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                        {showEmojiPicker && (
                            <div 
                                ref={emojiPickerRef} 
                                className="absolute bottom-full right-0 mb-2 z-50"
                                style={{ maxWidth: '100vw' }}
                            >
                                <EmojiPicker 
                                    onEmojiClick={handleEmojiClick}
                                    width={320}
                                    height={400}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;