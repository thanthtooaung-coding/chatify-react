import React, { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [username, setUsername] = useState('');
    const [isUsernameSet, setIsUsernameSet] = useState(false);
    const socketRef = useRef(null);
    const userID = useRef(uuidv4());
    const messageTimestamps = useRef(new Set());

    useEffect(() => {
        socketRef.current = new WebSocket('wss://chatify-go.onrender.com/ws');

        socketRef.current.onmessage = (event) => {
            const parsedMessage = JSON.parse(event.data);
            console.log(parsedMessage);

            if (!messageTimestamps.current.has(parsedMessage.timestamp)) {
                setMessages((prev) => [...prev, parsedMessage]);
                messageTimestamps.current.add(parsedMessage.timestamp);
            }

            console.log(messages);
        };

        socketRef.current.onclose = () => {
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
    

    return (
        <div className="App">
            <h1>Chat App {isUsernameSet ? `(${username})` : ""}</h1>
            {!isUsernameSet ? (
                <div className="username-setup">
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button onClick={handleSetUsername}>Set Username</button>
                </div>
            ) : (
                <>
                    <div className="messages">
                        {messages.map((message, index) => (
                            <p key={index}>
                                <strong>{message.userID === userID.current ? "You" : message.username}:</strong> {message.content} <em>({new Date(message.timestamp).toLocaleTimeString()})</em>
                            </p>
                        ))}
                    </div>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message"
                    />
                    <button onClick={sendMessage}>Send</button>
                </>
            )}
        </div>
    );
}

export default App;
