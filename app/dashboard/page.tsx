'use client';

import React, { useState } from 'react';
import { Bell, Plus, Calendar, User } from 'lucide-react';

const WalkingManIcon = () => (
    <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        className="animate-walk"
    >
        <g className="walking-figure">
            {/* Head */}
            <circle cx="30" cy="15" r="6" fill="#a3e635" />

            {/* Body */}
            <line x1="30" y1="21" x2="30" y2="35" stroke="#a3e635" strokeWidth="3" strokeLinecap="round" />

            {/* Left Arm */}
            <line x1="30" y1="25" x2="22" y2="32" stroke="#a3e635" strokeWidth="3" strokeLinecap="round" className="arm-left" />

            {/* Right Arm */}
            <line x1="30" y1="25" x2="38" y2="32" stroke="#a3e635" strokeWidth="3" strokeLinecap="round" className="arm-right" />

            {/* Left Leg */}
            <line x1="30" y1="35" x2="24" y2="48" stroke="#a3e635" strokeWidth="3" strokeLinecap="round" className="leg-left" />

            {/* Right Leg */}
            <line x1="30" y1="35" x2="36" y2="48" stroke="#a3e635" strokeWidth="3" strokeLinecap="round" className="leg-right" />
        </g>
    </svg>
);

export default function ShiftApp() {
    const [activeTab, setActiveTab] = useState('home');

    const friends = [
        { id: 1, name: 'Active Jeri', steps: 12000, time: 'now', avatar: '🏃', position: 1 },
        { id: 2, name: 'You', steps: 8500, time: '2hrs ago', avatar: '🇬🇧', position: 2, isUser: true },
        { id: 3, name: 'Lazy Jo', steps: 3100, time: '2hrs ago', avatar: '🏃', position: 3 },
        { id: 4, name: 'Bertha', steps: 5000, time: '5hrs ago', avatar: '👤', position: 4, flag: '🇬🇭' }
    ];

    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans">
            <style jsx>{`
        @keyframes walk {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        
        @keyframes legSwing {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-15deg); }
          75% { transform: rotate(15deg); }
        }
        
        @keyframes armSwing {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(15deg); }
          75% { transform: rotate(-15deg); }
        }
        
        .animate-walk {
          animation: walk 1s ease-in-out infinite;
        }
        
        .leg-left {
          transform-origin: 30px 35px;
          animation: legSwing 1s ease-in-out infinite;
        }
        
        .leg-right {
          transform-origin: 30px 35px;
          animation: legSwing 1s ease-in-out infinite;
          animation-delay: 0.5s;
        }
        
        .arm-left {
          transform-origin: 30px 25px;
          animation: armSwing 1s ease-in-out infinite;
          animation-delay: 0.5s;
        }
        
        .arm-right {
          transform-origin: 30px 25px;
          animation: armSwing 1s ease-in-out infinite;
        }
      `}</style>

            {/* Container */}
            <div className="max-w-md mx-auto bg-gray-950 min-h-screen md:shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 pt-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-lime-400 flex items-center justify-center font-bold text-black text-xl transform -skew-x-12">
                            N
                        </div>
                        <span className="text-2xl font-bold">SHIFT</span>
                    </div>
                    <button className="relative">
                        <Bell className="w-6 h-6" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-lime-400 rounded-full"></span>
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 px-4 mt-4">
                    <button
                        onClick={() => setActiveTab('home')}
                        className={`flex-1 py-3 rounded-full font-semibold transition-all ${activeTab === 'home'
                                ? 'bg-white text-black'
                                : 'bg-gray-800 text-gray-400'
                            }`}
                    >
                        Home
                    </button>
                    <button
                        onClick={() => setActiveTab('groups')}
                        className={`flex-1 py-3 rounded-full font-semibold transition-all ${activeTab === 'groups'
                                ? 'bg-white text-black'
                                : 'bg-gray-800 text-gray-400'
                            }`}
                    >
                        Groups
                    </button>
                </div>

                {/* Steps Card */}
                <div className="mx-4 mt-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-gray-700/50 px-3 py-2 rounded-full text-sm">
                        <span className="text-gray-300">👟 10,000</span>
                        <div className="w-8 h-8 bg-lime-400 rounded-full flex items-center justify-center">
                            <span className="text-black font-bold">→</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative w-32 h-32">
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="#374151"
                                    strokeWidth="12"
                                    fill="none"
                                />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="#a3e635"
                                    strokeWidth="12"
                                    fill="none"
                                    strokeDasharray={`${(8500 / 10000) * 352} 352`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <WalkingManIcon />
                            </div>
                        </div>

                        <div>
                            <div className="text-5xl font-bold">8,500</div>
                            <div className="text-gray-400 text-sm mt-1">STEPS TODAY</div>
                        </div>
                    </div>
                </div>

                {/* Date and Add Friend */}
                <div className="flex items-center justify-between px-4 mt-6">
                    <button className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Today</span>
                        <span className="text-xs">▼</span>
                    </button>
                    <button className="flex items-center gap-2 text-lime-400 text-sm font-semibold">
                        <Plus className="w-4 h-4" />
                        Add new friend
                    </button>
                </div>

                {/* Leaderboard */}
                <div className="px-4 mt-4 pb-24">
                    {friends.map((friend) => (
                        <div
                            key={friend.id}
                            className={`flex items-center gap-4 p-4 rounded-2xl mb-2 ${friend.isUser ? 'bg-gray-800' : 'bg-gray-900'
                                }`}
                        >
                            <div className="text-gray-500 font-bold w-6">{friend.position}</div>

                            <div className="relative">
                                <div className="w-12 h-12 bg-lime-400 rounded-full flex items-center justify-center text-2xl">
                                    {friend.avatar}
                                </div>
                                {friend.flag && (
                                    <div className="absolute -bottom-1 -right-1 text-xs">
                                        {friend.flag}
                                    </div>
                                )}
                                {friend.isUser && (
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        GB
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="font-semibold">{friend.name}</div>
                                {friend.name === 'Bertha' && (
                                    <div className="text-xs text-gray-500">Ghana</div>
                                )}
                                {friend.isUser && (
                                    <div className="text-xs text-gray-500">United Kingdom</div>
                                )}
                            </div>

                            <div className="text-right">
                                <div className="text-xl font-bold">
                                    {friend.steps.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500">{friend.time}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Navigation */}
                <div className="fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 md:max-w-md md:mx-auto">
                    <div className="flex items-center justify-around py-4 px-2">
                        <button className="flex flex-col items-center gap-1">
                            <div className="text-lime-400">🏃</div>
                            <span className="text-xs text-lime-400 font-semibold">Walk</span>
                        </button>
                        <button className="flex flex-col items-center gap-1">
                            <div className="text-gray-500">👥</div>
                            <span className="text-xs text-gray-500">Community</span>
                        </button>
                        <button className="flex flex-col items-center gap-1">
                            <div className="text-gray-500">💪</div>
                            <span className="text-xs text-gray-500">Workout</span>
                        </button>
                        <button className="flex flex-col items-center gap-1">
                            <div className="text-gray-500">🏆</div>
                            <span className="text-xs text-gray-500">Challenges</span>
                        </button>
                        <button className="flex flex-col items-center gap-1">
                            <User className="w-5 h-5 text-gray-500" />
                            <span className="text-xs text-gray-500">Space</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}