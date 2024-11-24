import React, { useState } from "react";
import { Hash, Volume2, Settings, ChevronDown, Plus, Headphones, Mic, X } from 'lucide-react';

export function ChannelList({ username, onClose }) {
    const [expandedCategories, setExpandedCategories] = useState({
        "TEXT CHANNELS": true,
        "VOICE CHANNELS": true,
    });

    const channels = {
        "TEXT CHANNELS": ["general", "random", "music", "gaming"],
        "VOICE CHANNELS": ["General", "Gaming", "Music"],
    };

    const toggleCategory = (category) => {
        setExpandedCategories((prev) => ({ ...prev, [category]: !prev[category] }));
    };

    return (
        <div className="w-60 bg-gray-800 flex flex-col h-full flex-shrink-0">
            <div className="h-12 min-h-[48px] px-4 border-b border-gray-900 flex items-center justify-between">
                <h2 className="text-white font-semibold text-base">Chatify Server</h2>
                <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
                    <X size={20} />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto pt-4">
                {Object.entries(channels).map(([category, channelList]) => (
                    <div key={category} className="px-2 mb-4">
                        <div
                            className="flex items-center justify-between text-gray-400 uppercase text-xs font-semibold mb-1 px-2 cursor-pointer hover:text-gray-300"
                            onClick={() => toggleCategory(category)}
                        >
                            <span>{category}</span>
                            <ChevronDown
                                size={12}
                                className={`transform transition-transform ${
                                    expandedCategories[category] ? "rotate-0" : "-rotate-90"
                                }`}
                            />
                        </div>
                        {expandedCategories[category] &&
                            channelList.map((channel, index) => (
                                <div
                                    key={index}
                                    className="flex items-center text-gray-400 hover:text-white hover:bg-gray-700 px-2 py-1.5 rounded cursor-pointer group text-sm"
                                >
                                    {category === "TEXT CHANNELS" ? (
                                        <Hash size={16} className="mr-1.5 flex-shrink-0" />
                                    ) : (
                                        <Volume2 size={16} className="mr-1.5 flex-shrink-0" />
                                    )}
                                    <span className="truncate">{channel}</span>
                                    {category === "TEXT CHANNELS" && (
                                        <Plus
                                            size={16}
                                            className="ml-auto opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white flex-shrink-0"
                                        />
                                    )}
                                </div>
                            ))}
                    </div>
                ))}
            </div>
            <div className="h-[52px] bg-gray-700/50 px-2 flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white relative flex-shrink-0">
                    <span className="text-sm font-medium">{username[0].toUpperCase()}</span>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-[2.5px] border-gray-700" />
                </div>
                <div className="ml-2 flex-1 min-w-0">
                    <div className="text-white font-medium text-sm truncate">{username}</div>
                    <div className="text-gray-400 text-xs truncate">Online</div>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-white">
                        <Mic size={16} />
                    </button>
                    <button className="text-gray-400 hover:text-white">
                        <Headphones size={16} />
                    </button>
                    <button className="text-gray-400 hover:text-white">
                        <Settings size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

