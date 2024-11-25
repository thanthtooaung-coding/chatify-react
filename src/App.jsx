import React, { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ServerList } from './components/ServerList';
import { ChannelList } from './components/ChannelList';
import { ChatMessage } from './components/ChatMessage';
import { Hash, Send, PlusCircle, AtSign, Smile, Gift, Menu, ImageIcon, X, Users } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { ChatWelcome } from './components/ChatWelcome';

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [username, setUsername] = useState('');
    const [isUsernameSet, setIsUsernameSet] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [activeUsers, setActiveUsers] = useState(0);
    const socketRef = useRef(null);
    const userID = useRef(uuidv4());
    const messageTimestamps = useRef(new Set());
    const messagesEndRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);
    const [selectedImageForModal, setSelectedImageForModal] = useState(null);

    useEffect(() => {        
        return () => {
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.close();
            }
        };
    }, []);

    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

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

            if (!socketRef.current) {
                socketRef.current = new WebSocket('wss://chatify-go.onrender.com/ws');
    
                socketRef.current.onopen = () => {
                    setIsConnected(true);
                };
    
                socketRef.current.onmessage = (event) => {
                    const parsedMessage = JSON.parse(event.data);
                    if (parsedMessage.type === 'activeUsers') {
                        setActiveUsers(parsedMessage.count);
                    } else if (!messageTimestamps.current.has(parsedMessage.timestamp)) {
                        setMessages((prev) => [...prev, parsedMessage]);
                        messageTimestamps.current.add(parsedMessage.timestamp);
                    }
                };
    
                socketRef.current.onclose = () => {
                    setIsConnected(false);
                    console.log("WebSocket connection closed");
                    socketRef.current = null;
                };
    
                socketRef.current.onerror = (error) => {
                    console.error("WebSocket error:", error);
                };
    
            }
        }
    };

    const handleEmojiClick = (emojiObject) => {
        setInput((prevInput) => prevInput + emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const closeModal = () => {
        setSelectedImageForModal(null);
    };

    const sendMessage = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && (input || selectedImage) && isUsernameSet) {
            const messageObject = {
                userID: userID.current,
                username: username,
                content: input,
                image: selectedImage,
                timestamp: new Date().toISOString(),
            };

            socketRef.current.send(JSON.stringify(messageObject));

            if (!messageTimestamps.current.has(messageObject.timestamp)) {
                setMessages((prev) => [...prev, messageObject]);
                messageTimestamps.current.add(messageObject.timestamp);
            }

            setInput('');
            setSelectedImage(null);
        }
    };

    if (!isUsernameSet) {
        return (
            <ChatWelcome
                username={username}
                setUsername={setUsername}
                onSubmit={handleSetUsername}
            />
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
                        <div className="flex items-center text-gray-400">
                            <Users size={20} className="mr-2" />
                            <span>{activeUsers}</span>
                        </div>
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
                                onImageClick={(image) => setSelectedImageForModal(image)}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Chat Input */}
                <div className="p-4 bg-gray-800">
                    <div className="flex items-center bg-gray-700 rounded-lg relative">
                    <button 
                            className="p-3 text-gray-400 hover:text-white"
                            onClick={() => fileInputRef.current.click()}
                        >
                            <ImageIcon size={20} />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
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
                        {selectedImage && (
                            <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-700 rounded">
                                <img src={selectedImage} alt="Selected" className="max-w-xs max-h-32 rounded" />
                                <button 
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                    onClick={() => setSelectedImage(null)}
                                >
                                <X size={12} />
                                </button>
                            </div>
                        )}
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
            {selectedImageForModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
                    onClick={closeModal}
                >
                    {/* The X button positioned at the top-right corner of the modal */}
                    <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 p-2 bg-gray-800 text-white rounded-full z-50"
                    >
                        <X size={24} />
                    </button>
                    <div className="relative max-w-full max-h-full p-6" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={selectedImageForModal}
                            alt="Full-screen content"
                            className="object-contain max-w-screen max-h-screen rounded-lg"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;