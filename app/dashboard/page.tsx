'use client';

import React, { useState } from 'react';
import { Bell, Plus, Calendar, User } from 'lucide-react';

const WalkingManIcon = () => (
    <svg width="50" height="50" viewBox="0 0 60 60">
        <g>
            {/* Head */}
            <circle cx="30" cy="14" r="6" fill="#a3e635" />

            {/* Body */}
            <line
                x1="30"
                y1="20"
                x2="30"
                y2="34"
                stroke="#a3e635"
                strokeWidth="3"
                strokeLinecap="round"
            />

            {/* Arms */}
            <line
                x1="30"
                y1="24"
                x2="22"
                y2="30"
                stroke="#a3e635"
                strokeWidth="3"
                strokeLinecap="round"
                className="arm-left"
            />
            <line
                x1="30"
                y1="24"
                x2="38"
                y2="30"
                stroke="#a3e635"
                strokeWidth="3"
                strokeLinecap="round"
                className="arm-right"
            />

            {/* Legs */}
            <line
                x1="30"
                y1="34"
                x2="24"
                y2="48"
                stroke="#a3e635"
                strokeWidth="3"
                strokeLinecap="round"
                className="leg-left"
            />
            <line
                x1="30"
                y1="34"
                x2="36"
                y2="48"
                stroke="#a3e635"
                strokeWidth="3"
                strokeLinecap="round"
                className="leg-right"
            />
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
        <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col md:flex-row">
            <style jsx>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(86px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(86px) rotate(-360deg);
          }
        }

        @keyframes legSwing {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-20deg); }
          75% { transform: rotate(20deg); }
        }

        @keyframes armSwing {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-20deg); }
        }

        .orbit {
          position: absolute;
          width: 100%;
          height: 100%;
          animation: orbit 6s linear infinite;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .leg-left {
          transform-origin: 30px 34px;
          animation: legSwing 1s ease-in-out infinite;
        }

        .leg-right {
          transform-origin: 30px 34px;
          animation: legSwing 1s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        .arm-left {
          transform-origin: 30px 24px;
          animation: armSwing 1s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        .arm-right {
          transform-origin: 30px 24px;
          animation: armSwing 1s ease-in-out infinite;
        }
      `}</style>

            {/* Desktop Sidebar Navigation */}
            <aside className="hidden md:flex flex-col w-64 bg-gray-900 border-r border-gray-800 h-screen sticky top-0">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-10">
                        <div className="w-8 h-8 bg-lime-400 flex items-center justify-center font-bold text-black text-xl transform -skew-x-12">
                            N
                        </div>
                        <span className="text-2xl font-bold">SHIFT</span>
                    </div>

                    <nav className="space-y-4">
                        <button className="flex items-center gap-4 w-full p-3 rounded-2xl bg-lime-400 text-black font-bold transition-all">
                            <span className="text-xl">🏃</span>
                            <span>Walk</span>
                        </button>
                        <button className="flex items-center gap-4 w-full p-3 rounded-2xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
                            <span className="text-xl">👥</span>
                            <span>Community</span>
                        </button>
                        <button className="flex items-center gap-4 w-full p-3 rounded-2xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
                            <span className="text-xl">💪</span>
                            <span>Workout</span>
                        </button>
                        <button className="flex items-center gap-4 w-full p-3 rounded-2xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
                            <span className="text-xl">🏆</span>
                            <span>Challenges</span>
                        </button>
                        <button className="flex items-center gap-4 w-full p-3 rounded-2xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
                            <User className="w-6 h-6" />
                            <span>Space</span>
                        </button>
                    </nav>
                </div>

                <div className="mt-auto p-6">
                    <div className="bg-gray-800/50 rounded-2xl p-4 border border-white/5">
                        <p className="text-xs text-gray-500 uppercase font-black tracking-widest mb-2">Monthly Goal</p>
                        <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-lime-400 h-full w-[65%]"></div>
                        </div>
                        <p className="text-xs text-white mt-2 font-bold">165,000 / 250,000 steps</p>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-h-screen">
                <div className="max-w-6xl mx-auto md:p-6 lg:p-10">

                    {/* Header */}
                    <div className="flex items-center justify-between p-4 pt-6">
                        <div className="flex items-center gap-2 md:hidden">
                            <div className="w-8 h-8 bg-lime-400 flex items-center justify-center font-bold text-black text-xl transform -skew-x-12">
                                N
                            </div>
                            <span className="text-2xl font-bold">SHIFT</span>
                        </div>
                        <div className="hidden md:block">
                            <h1 className="text-3xl font-black italic tracking-tight">DASHBOARD</h1>
                            <p className="text-gray-500 text-sm">Welcome back! Here's your shift summary.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="hidden md:flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl transition-all">
                                <Calendar className="w-4 h-4 text-lime-400" />
                                <span className="text-sm font-bold">Dec 27, 2025</span>
                            </button>
                            <button className="relative p-2 bg-gray-900 rounded-xl border border-white/5 hover:border-lime-400/30 transition-all">
                                <Bell className="w-6 h-6" />
                                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-lime-400 rounded-full border-2 border-gray-900"></span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 md:px-0">
                        {/* Left/Main Column - Span 8 */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* Tab Navigation */}
                            <div className="flex gap-2 bg-gray-900/50 p-1.5 rounded-2xl w-fit">
                                <button
                                    onClick={() => setActiveTab('home')}
                                    className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'home'
                                        ? 'bg-white text-black shadow-lg shadow-white/5'
                                        : 'text-gray-500 hover:text-gray-300 whitespace-nowrap'
                                        }`}
                                >
                                    Home
                                </button>
                                <button
                                    onClick={() => setActiveTab('groups')}
                                    className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'groups'
                                        ? 'bg-white text-black shadow-lg shadow-white/5'
                                        : 'text-gray-500 hover:text-gray-300 whitespace-nowrap'
                                        }`}
                                >
                                    Groups
                                </button>
                            </div>


                            {/* Steps Card */}
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 md:from-gray-900 md:to-gray-800 rounded-3xl p-8 relative overflow-hidden border border-white/5 shadow-2xl">
                                <div className="absolute top-6 right-6 flex items-center gap-3">
                                    <div className="hidden sm:flex flex-col items-end">
                                        <span className="text-gray-400 text-xs font-black tracking-widest uppercase">Target</span>
                                        <span className="text-white font-bold">10,000 steps</span>
                                    </div>
                                    <div className="w-10 h-10 bg-lime-400 rounded-xl flex items-center justify-center shadow-lg shadow-lime-400/20">
                                        <span className="text-black font-black text-xl">→</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
                                    <div className="relative w-40 h-40">
                                        <svg className="w-40 h-40 transform -rotate-90">
                                            <circle
                                                cx="80"
                                                cy="80"
                                                r="72"
                                                stroke="#1f2937"
                                                strokeWidth="14"
                                                fill="none"
                                            />
                                            <circle
                                                cx="80"
                                                cy="80"
                                                r="72"
                                                stroke="#a3e635"
                                                strokeWidth="14"
                                                fill="none"
                                                strokeDasharray={`${(8500 / 10000) * 452.4} 452.4`}
                                                strokeLinecap="round"
                                                className="transition-all duration-1000 ease-out"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center scale-125">
                                            <WalkingManIcon />
                                        </div>
                                    </div>

                                    <div className="text-center sm:text-left">
                                        <div className="text-6xl md:text-7xl font-black italic tracking-tighter">8,500</div>
                                        <div className="text-lime-400 font-black tracking-[0.2em] text-sm mt-1 uppercase">Steps Today</div>

                                        <div className="flex items-center gap-4 mt-6">
                                            <div className="bg-gray-800/80 px-4 py-2 rounded-xl backdrop-blur-sm">
                                                <div className="text-gray-400 text-[10px] font-black uppercase">Calories</div>
                                                <div className="text-white font-bold">420 kcal</div>
                                            </div>
                                            <div className="bg-gray-800/80 px-4 py-2 rounded-xl backdrop-blur-sm">
                                                <div className="text-gray-400 text-[10px] font-black uppercase">Distance</div>
                                                <div className="text-white font-bold">6.2 km</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* PC Only: Additional Stats Row */}
                            <div className="hidden md:grid grid-cols-2 gap-6">
                                <div className="bg-gray-900 p-6 rounded-3xl border border-white/5 hover:border-lime-400/20 transition-all cursor-pointer group">
                                    <h4 className="text-gray-500 font-black text-xs tracking-widest mb-4 uppercase">Weekly Average</h4>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <span className="text-3xl font-black italic">9,240</span>
                                            <span className="text-lime-400 text-xs font-bold ml-2">+12%</span>
                                        </div>
                                        <div className="flex gap-1 h-12">
                                            {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                                                <div key={i} className="w-1.5 bg-gray-800 rounded-full relative overflow-hidden self-end h-full">
                                                    <div className="absolute bottom-0 w-full bg-lime-400/40 group-hover:bg-lime-400 transition-all duration-500" style={{ height: `${h}%` }}></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-900 p-6 rounded-3xl border border-white/5 hover:border-lime-400/20 transition-all cursor-pointer">
                                    <h4 className="text-gray-500 font-black text-xs tracking-widest mb-4 uppercase">Active Friends</h4>
                                    <div className="flex items-center -space-x-2">
                                        {friends.slice(0, 3).map((f) => (
                                            <div key={f.id} className="w-10 h-10 rounded-full border-2 border-gray-900 bg-lime-400 flex items-center justify-center text-xl shadow-lg ring-2 ring-lime-400/20">
                                                {f.avatar}
                                            </div>
                                        ))}
                                        <div className="w-10 h-10 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400 shadow-lg">
                                            +5
                                        </div>
                                        <div className="ml-6 text-sm font-bold text-white hover:text-lime-400 transition-colors">
                                            View All activity
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right/Sidebar Column - Span 4 */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Leaderboard Section */}
                            <div className="bg-gray-900/50 rounded-3xl p-6 border border-white/5 h-full">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="font-black italic text-xl tracking-tight uppercase">Leaderboard</h3>
                                    <button className="text-lime-400 p-2 hover:bg-lime-400/10 rounded-xl transition-all">
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {friends.map((friend) => (
                                        <div
                                            key={friend.id}
                                            className={`flex items-center gap-4 p-4 rounded-2xl transition-all hover:translate-x-1 cursor-pointer ${friend.isUser ? 'bg-lime-400/10 border border-lime-400/20' : 'bg-black/20 hover:bg-black/40'
                                                }`}
                                        >
                                            <div className="text-gray-600 font-black w-4 text-xs italic">{friend.position}</div>

                                            <div className="relative">
                                                <div className="w-12 h-12 bg-lime-400 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-lime-400/10">
                                                    {friend.avatar}
                                                </div>
                                                {friend.flag && (
                                                    <div className="absolute -bottom-1 -right-1 text-xs drop-shadow-md">
                                                        {friend.flag}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold truncate">{friend.name}</div>
                                                <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{friend.time}</div>
                                            </div>

                                            <div className="text-right">
                                                <div className="text-lg font-black italic text-white">
                                                    {friend.steps.toLocaleString()}
                                                </div>
                                                <div className="text-[9px] text-lime-400 font-bold uppercase tracking-widest">Steps</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full mt-8 py-4 px-6 rounded-2xl bg-gray-800 text-gray-400 text-sm font-bold hover:bg-gray-700 hover:text-white transition-all border border-white/5">
                                    Show More rankings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Navigation - Only on Mobile */}
                <div className="fixed bottom-0 left-0 right-0 bg-gray-950/80 backdrop-blur-xl border-t border-gray-800 md:hidden z-50">
                    <div className="flex items-center justify-around py-4 px-2">
                        <button className="flex flex-col items-center gap-1 group">
                            <div className="text-xl group-active:scale-125 transition-transform text-lime-400">🏃</div>
                            <span className="text-[10px] text-lime-400 font-black uppercase tracking-widest">Walk</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 group opacity-40">
                            <div className="text-xl group-active:scale-125 transition-transform text-gray-500">👥</div>
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Team</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 group opacity-40">
                            <div className="text-xl group-active:scale-125 transition-transform text-gray-500">💪</div>
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Gym</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 group opacity-40">
                            <div className="text-xl group-active:scale-125 transition-transform text-gray-500">🏆</div>
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Win</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 group opacity-40">
                            <User className="w-5 h-5 text-gray-500" />
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Me</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
