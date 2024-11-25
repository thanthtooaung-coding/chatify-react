import React, { useState } from "react";
import { MessageCircle } from 'lucide-react';

export function ChatWelcome({ username, setUsername, onSubmit }) {
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0f172a] p-4">
            <div className="relative w-full md:max-w-md">
                <div className="pointer-events-none fixed inset-0 md:absolute md:-inset-1">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur-3xl" />
                </div>
                
                {/* Main content */}
                <div className="relative h-full w-full md:rounded-2xl md:border md:border-white/10 md:bg-[#1a2236]/80 md:p-8 md:backdrop-blur-xl">
                    <div className="relative z-10">
                        {/* Icon and text */}
                        <div className="mb-8 flex flex-col items-center space-y-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 shadow-lg">
                                <MessageCircle className="h-8 w-8 text-blue-400" />
                            </div>
                            <h1 className="text-center text-3xl font-bold text-white">Welcome to Chatify</h1>
                            <p className="text-center text-sm text-gray-400">
                                Enter your username to start chatting with friends and colleagues
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="group relative">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                        className="peer w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        required
                                    />
                                </div>
                                <div className="pointer-events-none absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 blur transition-opacity duration-200 peer-focus:opacity-20" />
                            </div>
                            <button
                                type="submit"
                                disabled={!username.trim()}
                                className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:shadow-blue-500/25 disabled:pointer-events-none disabled:opacity-50"
                            >
                                Start Chatting
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

