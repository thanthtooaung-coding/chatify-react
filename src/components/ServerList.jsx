import React from 'react';
import { Hash, Plus } from 'lucide-react';

export function ServerList() {
    const servers = ['General', 'Gaming', 'Music', 'Movies'];

    return (
        <div className="w-[72px] bg-gray-900 flex flex-col items-center py-3 space-y-3 h-full flex-shrink-0">
            <div className="w-12 h-12 bg-indigo-500 rounded-2xl hover:rounded-xl flex items-center justify-center text-white hover:bg-indigo-600 transition-all duration-200 cursor-pointer">
                <Hash size={24} />
            </div>
            <div className="w-8 h-0.5 bg-gray-700 rounded-full mx-auto" />
            {servers.map((server, index) => (
                <div
                    key={index}
                    className="w-12 h-12 bg-gray-700 rounded-[24px] hover:rounded-xl flex items-center justify-center text-white hover:bg-indigo-500 transition-all duration-200 cursor-pointer group relative"
                >
                    <span className="text-lg font-semibold">{server[0].toUpperCase()}</span>
                    <div className="absolute left-0 w-1 bg-white rounded-r-full h-0 group-hover:h-8 transition-all duration-200" />
                </div>
            ))}
            <div className="w-12 h-12 bg-gray-700 rounded-[24px] hover:rounded-xl flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition-all duration-200 cursor-pointer">
                <Plus size={24} />
            </div>
        </div>
    );
}

