import React from 'react';
import { MoreHorizontal, Smile, Reply } from 'lucide-react';

export function ChatMessage({ message, isCurrentUser }) {
    return (
        <div className="group flex items-start space-x-3 py-0.5 px-4 -mx-4 hover:bg-gray-800/50">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">{message.username[0].toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-baseline">
                    <span className="text-white font-medium mr-2">{message.username}</span>
                    <span className="text-gray-400 text-xs">
                        {new Date(message.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit'
                        })}
                    </span>
                </div>
                <p className="text-gray-100 break-words text-[0.9375rem] leading-[1.375rem]">
                    {message.content}
                </p>
            </div>
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 text-gray-400 hover:text-white rounded hover:bg-gray-700">
                    <Smile size={16} />
                </button>
                <button className="p-1 text-gray-400 hover:text-white rounded hover:bg-gray-700">
                    <Reply size={16} />
                </button>
                <button className="p-1 text-gray-400 hover:text-white rounded hover:bg-gray-700">
                    <MoreHorizontal size={16} />
                </button>
            </div>
        </div>
    );
}
