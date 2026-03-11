'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    Bell,
    ArrowLeft,
    Users,
    Layers,
    Activity,
    MoreVertical,
    Search,
    Filter,
    ChevronRight,
    UserPlus,
    Calendar,
    Mail,
    Globe,
    Shield
} from 'lucide-react';

// --- Mock Data ---

const users = [
    { id: 1, name: 'Active Jeri', email: 'jeri@shift.com', role: 'Admin', status: 'Online', joinDate: 'Dec 12, 2024', avatar: '🏃', country: '🇬🇧' },
    { id: 2, name: 'Bertha', email: 'bertha@shift.com', role: 'User', status: 'Away', joinDate: 'Jan 05, 2025', avatar: '👤', country: '🇬🇭' },
    { id: 3, name: 'Lazy Jo', email: 'jo@shift.com', role: 'User', status: 'Offline', joinDate: 'Feb 15, 2025', avatar: '🏃', country: '🇺🇸' },
    { id: 4, name: 'Swift Runner', email: 'swift@shift.com', role: 'Moderator', status: 'Online', joinDate: 'Mar 01, 2025', avatar: '⚡', country: '🇮🇳' },
];

const groups = [
    {
        id: 1,
        name: 'London Sprinters',
        members: 124,
        type: 'Public',
        subgroups: [
            { id: 101, name: 'Morning Shift', members: 45 },
            { id: 102, name: 'Night Owls', members: 79 }
        ]
    },
    {
        id: 2,
        name: 'Tech Walkers',
        members: 890,
        type: 'Private',
        subgroups: [
            { id: 201, name: 'Dev Team', members: 120 },
            { id: 202, name: 'QA Squad', members: 50 },
            { id: 203, name: 'Design Hub', members: 35 }
        ]
    },
    {
        id: 3,
        name: 'Global Guardians',
        members: 5200,
        type: 'Public',
        subgroups: [
            { id: 301, name: 'Europe', members: 1500 },
            { id: 302, name: 'Asia', members: 2200 },
            { id: 303, name: 'Americas', members: 1500 }
        ]
    },
];

// --- Components ---

const ActivityPulse = () => {
    return (
        <div className="relative h-32 w-full flex items-end gap-1 px-2">
            {[...Array(40)].map((_, i) => (
                <div
                    key={i}
                    className="flex-1 bg-lime-400/20 rounded-full relative overflow-hidden group/bar"
                    style={{ height: `${Math.random() * 80 + 20}%` }}
                >
                    <div
                        className="absolute bottom-0 w-full bg-lime-400 animate-pulse"
                        style={{
                            height: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: `${1.5 + Math.random()}s`
                        }}
                    ></div>
                </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent pointer-events-none" />
        </div>
    );
};

export default function AdminPanel() {
    const router = useRouter();
    const [view, setView] = useState('users'); // 'users' or 'groups'
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-lime-400 selection:text-black">
            {/* Glassmorphism Styles */}
            <style jsx global>{`
                .glass {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .glass-hover:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(163, 230, 53, 0.2);
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up {
                    animation: slideUp 0.5s ease-out forwards;
                }
            `}</style>

            <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row h-screen overflow-hidden">

                {/* Lateral Sidebar */}
                <aside className="hidden lg:flex flex-col w-72 h-full glass border-r border-white/5 p-8 gap-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 relative">
                            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                        </div>
                        <span className="text-2xl font-black italic tracking-tighter">SHIFT ADMIN</span>
                    </div>

                    <nav className="flex flex-col gap-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Management</p>
                        <button
                            onClick={() => setView('users')}
                            className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${view === 'users' ? 'bg-lime-400 text-black font-bold shadow-lg shadow-lime-400/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Users size={20} />
                            <span>Users</span>
                        </button>
                        <button
                            onClick={() => setView('groups')}
                            className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${view === 'groups' ? 'bg-lime-400 text-black font-bold shadow-lg shadow-lime-400/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Layers size={20} />
                            <span>Groups</span>
                        </button>
                    </nav>

                    <div className="mt-auto">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="flex items-center gap-4 p-4 w-full rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <ArrowLeft size={20} />
                            <span>Back to App</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col overflow-hidden">

                    {/* Top Header */}
                    <header className="p-6 md:p-10 flex items-center justify-between border-b border-white/5 glass">
                        <div className="flex items-center gap-4 lg:hidden">
                            <button onClick={() => router.push('/dashboard')} className="p-2 glass rounded-xl">
                                <ArrowLeft size={20} />
                            </button>
                            <span className="text-xl font-black italic">ADMIN</span>
                        </div>
                        <div className="hidden md:block">
                            <h1 className="text-4xl font-black italic tracking-tighter uppercase">{view === 'users' ? 'User Ecosystem' : 'Group Architecture'}</h1>
                            <p className="text-gray-500 text-sm mt-1">{view === 'users' ? 'Monitor, manage and moderate every user activity.' : 'Oversee global communities and nested subgroups.'}</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center glass rounded-2xl px-4 py-2 gap-3 border border-white/10 group focus-within:border-lime-400/50 transition-all">
                                <Search size={18} className="text-gray-500 group-focus-within:text-lime-400 translate-y-[1px]" />
                                <input
                                    type="text"
                                    placeholder="Search details..."
                                    className="bg-transparent border-none outline-none text-sm w-48 font-medium"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button className="relative p-3 glass rounded-2xl hover:border-lime-400/30 transition-all group">
                                <Bell size={22} className="group-hover:text-lime-400" />
                                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-lime-400 rounded-full border-2 border-gray-950"></span>
                            </button>
                        </div>
                    </header>

                    {/* Scrollable Container */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar">

                        {/* Summary Stats & Pulse */}
                        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-slide-up">
                            <div className="xl:col-span-2 glass rounded-[2.5rem] p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8">
                                    <Activity className="text-lime-400/20 group-hover:text-lime-400/40 transition-all" size={80} />
                                </div>
                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div>
                                        <h2 className="text-lime-400 font-black tracking-[0.3em] text-xs uppercase mb-2">Live System Activity</h2>
                                        <div className="text-5xl font-black italic flex items-baseline gap-2">
                                            <span>Pulse</span>
                                            <span className="text-lg font-bold text-lime-400/60 not-italic">98.2% stability</span>
                                        </div>
                                    </div>
                                    <div className="mt-8">
                                        <ActivityPulse />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 xl:grid-cols-1 gap-6">
                                <div className="glass rounded-[2rem] p-6 flex flex-col justify-between group hover:border-lime-400/30 transition-all">
                                    <Users className="text-gray-500 group-hover:text-lime-400" size={24} />
                                    <div>
                                        <div className="text-4xl font-black italic">14.2K</div>
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">+2.4% this week</div>
                                    </div>
                                </div>
                                <div className="glass rounded-[2rem] p-6 flex flex-col justify-between group hover:border-lime-400/30 transition-all">
                                    <Layers className="text-gray-500 group-hover:text-lime-400" size={24} />
                                    <div>
                                        <div className="text-4xl font-black italic">642</div>
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Global Clusters</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* List Section */}
                        <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <div className="glass rounded-[2.5rem] overflow-hidden">
                                <div className="p-8 pb-4 flex items-center justify-between">
                                    <h3 className="text-xl font-black italic uppercase tracking-tight">{view === 'users' ? 'User Central' : 'Group Hierarchy'}</h3>
                                    <div className="flex gap-2">
                                        <button className="p-2 glass rounded-xl text-gray-400 hover:text-white">
                                            <Filter size={20} />
                                        </button>
                                        <button className="flex items-center gap-2 bg-lime-400 text-black px-4 py-2 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all">
                                            {view === 'users' ? <UserPlus size={18} /> : <Layers size={18} />}
                                            <span className="text-sm">{view === 'users' ? 'Add User' : 'New Group'}</span>
                                        </button>
                                    </div>
                                </div>

                                {view === 'users' ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-white/5">
                                                    <th className="p-8 text-[10px] font-black uppercase text-gray-500 tracking-widest">User Details</th>
                                                    <th className="p-8 text-[10px] font-black uppercase text-gray-500 tracking-widest">Access Level</th>
                                                    <th className="p-8 text-[10px] font-black uppercase text-gray-500 tracking-widest">Engagement</th>
                                                    <th className="p-8 text-[10px] font-black uppercase text-gray-500 tracking-widest">Status</th>
                                                    <th className="p-8"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {users.map(user => (
                                                    <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                                                        <td className="p-8">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                                                    {user.avatar}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold flex items-center gap-2">
                                                                        {user.name}
                                                                        <span className="text-xs grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">{user.country}</span>
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                                                        <Mail size={10} />
                                                                        {user.email}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-8">
                                                            <div className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit ${user.role === 'Admin' ? 'bg-lime-400/20 text-lime-400' : 'bg-gray-800 text-gray-400'}`}>
                                                                {user.role}
                                                            </div>
                                                        </td>
                                                        <td className="p-8">
                                                            <div className="text-sm font-medium">Joined</div>
                                                            <div className="text-xs text-gray-500">{user.joinDate}</div>
                                                        </td>
                                                        <td className="p-8">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-2 h-2 rounded-full ${user.status === 'Online' ? 'bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.5)]' : user.status === 'Away' ? 'bg-orange-400' : 'bg-gray-600'}`}></div>
                                                                <span className="text-sm font-bold text-gray-300">{user.status}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-8">
                                                            <button className="p-2 text-gray-500 hover:text-white transition-colors">
                                                                <MoreVertical size={20} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="p-8 space-y-4">
                                        {groups.map(group => (
                                            <div key={group.id} className="glass rounded-[2rem] p-6 hover:border-lime-400/20 transition-all group/card">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-14 h-14 rounded-2xl bg-lime-400/10 flex items-center justify-center text-lime-400">
                                                            <Globe size={28} />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xl font-black italic">{group.name}</h4>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1"><Users size={12} /> {group.members} Members</span>
                                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1"><Shield size={12} /> {group.type}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button className="p-3 glass rounded-2xl group-hover/card:bg-lime-400 group-hover/card:text-black transition-all">
                                                        <ChevronRight size={20} />
                                                    </button>
                                                </div>

                                                <div className="pt-6 border-t border-white/5">
                                                    <p className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em] mb-4">Nested Clusters ({group.subgroups.length})</p>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                        {group.subgroups.map(sub => (
                                                            <div key={sub.id} className="glass rounded-xl p-3 flex items-center justify-between group/sub hover:bg-white/5 transition-all">
                                                                <span className="text-sm font-bold text-gray-300">{sub.name}</span>
                                                                <span className="text-[10px] font-black italic text-lime-400/60 ">{sub.members}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}
