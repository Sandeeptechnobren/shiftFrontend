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
    Search,
    Filter,
    Mail,
    Shield,
    X,
    Clock,
    CreditCard,
    FileText,
    TrendingUp,
    CheckCircle2,
    ArrowUpRight,
    Calendar
} from 'lucide-react';

// --- Mock Data ---

const mockUsers = [
    { id: 1, name: 'Active Jeri', email: 'jeri@shift.com', role: 'Admin', status: 'Online', joinDate: 'Dec 12, 2024', avatar: '🏃', country: '🇬🇧', paymentStatus: 'Paid', walkTime: '120h 45m', walkHistory: '8.5k avg/day', group: 'London Sprinters', paymentHistory: '$15/mo - Active', postDate: 'Dec 15, 2024', totalSteps: '1.2M' },
    { id: 2, name: 'Bertha', email: 'bertha@shift.com', role: 'User', status: 'Away', joinDate: 'Jan 05, 2025', avatar: '👤', country: '🇬🇭', paymentStatus: 'Unpaid', walkTime: '45h 20m', walkHistory: '3.2k avg/day', group: '-', paymentHistory: 'Free Tier', postDate: 'Jan 10, 2025', totalSteps: '340k' },
    { id: 3, name: 'Lazy Jo', email: 'jo@shift.com', role: 'User', status: 'Offline', joinDate: 'Feb 15, 2025', avatar: '🏃', country: '🇺🇸', paymentStatus: 'Paid', walkTime: '200h 10m', walkHistory: '12k avg/day', group: 'Tech Walkers', paymentHistory: '$15/mo - Active', postDate: 'Feb 16, 2025', totalSteps: '2.5M' },
    { id: 4, name: 'Swift Runner', email: 'swift@shift.com', role: 'Moderator', status: 'Online', joinDate: 'Mar 01, 2025', avatar: '⚡', country: '🇮🇳', paymentStatus: 'Paid', walkTime: '80h 30m', walkHistory: '15k avg/day', group: 'Global Guardians', paymentHistory: '$15/mo - Active', postDate: 'Mar 05, 2025', totalSteps: '890k' },
];

// --- Components ---

const ActivityPulse = () => {
    return (
        <div className="relative h-32 w-full flex items-end gap-1 px-2">
            {[...Array(40)].map((_, i) => (
                <div
                    key={i}
                    className="flex-1 bg-lime-400/20 rounded-full relative overflow-hidden group/bar transition-all hover:bg-lime-400/40"
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
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent pointer-events-none" />
        </div>
    );
};

export default function AdminPanel() {
    const router = useRouter();
    const [view, setView] = useState('users'); // 'users' or 'admin'
    const [searchTerm, setSearchTerm] = useState('');
    const [userFilter, setUserFilter] = useState('All'); // 'All', 'Paid', 'Unpaid'
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [dashboardData, setDashboardData] = useState({
        total_users: 0,
        total_groups: 0,
        total_steps: 0,
        total_friends: 0,
        paid_users: 0 // Mocked for now
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const role = localStorage.getItem('userRole');
            if (role !== 'Admin') {
                router.push('/dashboard');
                return;
            }
        }

        const fetchDashboardData = async () => {
            try {
                const response = await fetch('https://api.easycoders.in/projects/shift_backend/public/api/admin/dashboard');
                if (response.ok) {
                    const data = await response.json();
                    setDashboardData({
                        ...data,
                        paid_users: Math.floor(data.total_users * 0.4) // Mocking paid users as 40% of total
                    });
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [router]);

    const filteredUsers = mockUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = userFilter === 'All' ? true : userFilter === 'Paid' ? user.paymentStatus === 'Paid' : user.paymentStatus === 'Unpaid';
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-lime-400 selection:text-black flex flex-col md:flex-row h-screen overflow-hidden">
            <style jsx global>{`
                .glass {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .glass-card {
                    background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up {
                    animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fadeIn 0.4s ease-out forwards;
                }
                @keyframes scaleIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                
                ::-webkit-scrollbar {
                    width: 6px;
                }
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(163, 230, 53, 0.5);
                }
            `}</style>

            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-72 h-full glass border-r border-white/5 p-8 gap-10 shrink-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 relative">
                        <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                    </div>
                    <span className="font-black italic text-xl tracking-tight">SHIFT<span className="text-lime-400">ADMIN</span></span>
                </div>

                <nav className="flex flex-col gap-3 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 ml-2">Console</p>
                    <button
                        onClick={() => setView('users')}
                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${view === 'users' ? 'bg-lime-400 text-black font-bold shadow-[0_0_30px_rgba(163,230,53,0.3)] scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/5 hover:scale-[1.02]'}`}
                    >
                        <Users size={20} className={view === 'users' ? 'text-black' : ''} />
                        <span>Users</span>
                    </button>
                    <button
                        onClick={() => setView('admin')}
                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${view === 'admin' ? 'bg-lime-400 text-black font-bold shadow-[0_0_30px_rgba(163,230,53,0.3)] scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/5 hover:scale-[1.02]'}`}
                    >
                        <Shield size={20} className={view === 'admin' ? 'text-black' : ''} />
                        <span>Admin</span>
                    </button>
                </nav>

                <div className="mt-auto">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center gap-4 p-4 w-full rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 transition-all group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to App</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header */}
                <header className="p-6 md:p-8 flex items-center justify-between border-b border-white/5 glass z-10 shrink-0">
                    <div className="flex items-center gap-4 md:hidden">
                        <button onClick={() => router.push('/dashboard')} className="p-2 glass rounded-xl">
                            <ArrowLeft size={20} />
                        </button>
                    </div>
                    <div className="hidden md:block">
                        <h1 className="text-3xl font-black italic tracking-tighter uppercase">{view === 'users' ? 'User Ecosystem' : 'Admin Metrics'}</h1>
                        <p className="text-gray-500 text-sm mt-1">{view === 'users' ? 'Monitor, manage and moderate user activities.' : 'System-wide administrative overview.'}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center glass rounded-2xl px-4 py-2.5 gap-3 border border-white/10 group focus-within:border-lime-400/50 focus-within:shadow-[0_0_15px_rgba(163,230,53,0.1)] transition-all">
                            <Search size={18} className="text-gray-500 group-focus-within:text-lime-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search details..."
                                className="bg-transparent border-none outline-none text-sm w-48 font-medium placeholder:text-gray-600 focus:placeholder:text-gray-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="relative p-3 glass rounded-2xl hover:border-lime-400/30 transition-all group overflow-hidden">
                            <div className="absolute inset-0 bg-lime-400/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                            <Bell size={22} className="group-hover:text-lime-400 relative z-10 transition-colors" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-lime-400 rounded-full border border-gray-950 shadow-[0_0_5px_rgba(163,230,53,0.8)] z-10"></span>
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 relative scroll-smooth">
                    {view === 'admin' ? (
                        <div className="max-w-6xl mx-auto space-y-8 animate-slide-up">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Total Users */}
                                <div className="glass-card rounded-3xl p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-lime-400/5 rounded-full blur-2xl group-hover:bg-lime-400/10 transition-all"></div>
                                    <Users className="text-lime-400 mb-6" size={32} />
                                    <div className="text-5xl font-black italic text-white mb-2">{isLoading ? '...' : dashboardData.total_users.toLocaleString()}</div>
                                    <div className="text-sm font-black text-gray-500 uppercase tracking-widest">Total Users</div>
                                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-lime-400 bg-lime-400/10 w-fit px-3 py-1 rounded-full">
                                        <TrendingUp size={12} />
                                        <span>+12% this month</span>
                                    </div>
                                </div>
                                
                                {/* Paid Users */}
                                <div className="glass-card rounded-3xl p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-lime-400/5 rounded-full blur-2xl group-hover:bg-lime-400/10 transition-all"></div>
                                    <CreditCard className="text-lime-400 mb-6" size={32} />
                                    <div className="text-5xl font-black italic text-white mb-2">{isLoading ? '...' : dashboardData.paid_users.toLocaleString()}</div>
                                    <div className="text-sm font-black text-gray-500 uppercase tracking-widest">Paid Users</div>
                                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-lime-400 bg-lime-400/10 w-fit px-3 py-1 rounded-full">
                                        <TrendingUp size={12} />
                                        <span>+5% this month</span>
                                    </div>
                                </div>

                                {/* Total Groups */}
                                <div className="glass-card rounded-3xl p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-lime-400/5 rounded-full blur-2xl group-hover:bg-lime-400/10 transition-all"></div>
                                    <Layers className="text-lime-400 mb-6" size={32} />
                                    <div className="text-5xl font-black italic text-white mb-2">{isLoading ? '...' : dashboardData.total_groups.toLocaleString()}</div>
                                    <div className="text-sm font-black text-gray-500 uppercase tracking-widest">Total Groups</div>
                                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-gray-400 bg-white/5 w-fit px-3 py-1 rounded-full">
                                        <Activity size={12} />
                                        <span>Stable</span>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
                                <h2 className="text-xl font-black italic uppercase tracking-tight mb-8">System Activity</h2>
                                <ActivityPulse />
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-7xl mx-auto animate-slide-up">
                            {/* Users View Filters */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                <div className="flex gap-2 bg-gray-900/50 p-1.5 rounded-2xl w-fit glass">
                                    {['All', 'Paid', 'Unpaid'].map(flavor => (
                                        <button
                                            key={flavor}
                                            onClick={() => setUserFilter(flavor)}
                                            className={`px-6 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${userFilter === flavor
                                                ? 'bg-lime-400 text-black shadow-[0_0_15px_rgba(163,230,53,0.3)]'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            {flavor}
                                        </button>
                                    ))}
                                </div>
                                <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl font-bold transition-all border border-white/10 hover:border-white/20 shadow-xl">
                                    <Filter size={18} />
                                    <span className="text-sm">Advanced Filter</span>
                                </button>
                            </div>

                            {/* Users Table */}
                            <div className="glass-card rounded-[2rem] overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                                <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">User Details</th>
                                                <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Access</th>
                                                <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Status</th>
                                                <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Type</th>
                                                <th className="p-6"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {filteredUsers.map((user, idx) => (
                                                <tr
                                                    key={user.id}
                                                    onClick={() => setSelectedUser(user)}
                                                    className="group hover:bg-white/[0.04] transition-colors cursor-pointer animate-fade-in"
                                                    style={{ animationDelay: `${idx * 0.05}s` }}
                                                >
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:border-lime-400/30 transition-all duration-300 shadow-md">
                                                                {user.avatar}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold flex items-center gap-2 text-white group-hover:text-lime-400 transition-colors">
                                                                    {user.name}
                                                                    <span className="text-xs grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">{user.country}</span>
                                                                </div>
                                                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                                    <Mail size={10} />
                                                                    {user.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg w-fit ${user.role === 'Admin' ? 'bg-lime-400/10 text-lime-400 border border-lime-400/20' : 'bg-white/5 text-gray-400 border border-white/5'}`}>
                                                            {user.role}
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-2 h-2 rounded-full ${user.status === 'Online' ? 'bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.5)]' : user.status === 'Away' ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'bg-gray-600'}`}></div>
                                                            <span className="text-sm font-bold text-gray-300">{user.status}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-2">
                                                            {user.paymentStatus === 'Paid' ? (
                                                                <div className="flex items-center gap-1.5 text-lime-400 bg-lime-400/10 px-2.5 py-1 rounded-md text-xs font-bold border border-lime-400/20 shadow-[0_0_10px_rgba(163,230,53,0.05)]">
                                                                    <CheckCircle2 size={12} />
                                                                    Paid
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-1.5 text-gray-400 bg-gray-800/50 px-2.5 py-1 rounded-md text-xs font-bold border border-white/5">
                                                                    Unpaid
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-6 text-right">
                                                        <button className="p-2 text-gray-500 group-hover:text-lime-400 transition-colors rounded-xl group-hover:bg-lime-400/10 group-hover:scale-110">
                                                            <ArrowUpRight size={20} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {filteredUsers.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="p-10 text-center text-gray-500 font-bold">
                                                        No users found matching the criteria.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Detail Modal */}
                {selectedUser && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 md:p-8">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in" onClick={() => setSelectedUser(null)}></div>
                        
                        <div className="relative w-full max-w-4xl max-h-full overflow-y-auto glass-card rounded-[2.5rem] p-8 md:p-10 animate-scale-in border border-white/10 shadow-2xl">
                            {/* Close btn */}
                            <button 
                                onClick={() => setSelectedUser(null)}
                                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5 z-10 shadow-lg hover:scale-110"
                            >
                                <X size={24} />
                            </button>

                            {/* Header */}
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 border-b border-white/10 pb-10 relative">
                                <div className="absolute -top-10 -left-10 w-40 h-40 bg-lime-400/10 rounded-full blur-3xl pointer-events-none"></div>

                                <div className="w-32 h-32 rounded-3xl glass-card flex items-center justify-center text-6xl border border-lime-400/30 shadow-[0_0_40px_rgba(163,230,53,0.15)] relative">
                                    {selectedUser.avatar}
                                    <div className="absolute -bottom-3 -right-3 text-3xl bg-gray-900 rounded-full border-4 border-gray-900 shadow-xl">{selectedUser.country}</div>
                                </div>
                                <div className="text-center md:text-left flex-1 relative z-10">
                                    <div className="flex flex-col items-center md:items-start">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-4xl font-black italic tracking-tight">{selectedUser.name}</h2>
                                            <div className={`w-3 h-3 rounded-full ${selectedUser.status === 'Online' ? 'bg-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.6)]' : selectedUser.status === 'Away' ? 'bg-amber-400' : 'bg-gray-600'}`}></div>
                                        </div>
                                        <div className="text-gray-400 text-sm mt-1 flex items-center gap-2 font-medium">
                                            <Mail size={14} /> {selectedUser.email}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6">
                                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-300 shadow-md">
                                            <Shield size={14} className="text-lime-400" />
                                            {selectedUser.role}
                                        </div>
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md ${selectedUser.paymentStatus === 'Paid' ? 'bg-lime-400/10 border border-lime-400/30 text-lime-400' : 'bg-white/5 border border-white/10 text-gray-400'}`}>
                                            <CreditCard size={14} />
                                            {selectedUser.paymentStatus} Record
                                        </div>
                                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-300 shadow-md">
                                            <Calendar size={14} className="text-blue-400" />
                                            Joined {selectedUser.joinDate}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                <span>Complete</span> 
                                <span className="text-lime-400">Record</span>
                                <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Walk Time */}
                                <div className="glass rounded-2xl p-6 relative overflow-hidden group hover:border-lime-400/30 hover:bg-white/[0.04] transition-all shadow-lg hover:-translate-y-1">
                                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300 text-lime-400"><Clock size={48} /></div>
                                    <div className="relative z-10">
                                        <div className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><Clock size={12}/> Walk Time</div>
                                        <div className="text-2xl font-black italic tracking-tighter text-white">{selectedUser.walkTime}</div>
                                        <div className="text-[10px] bg-white/10 px-2 py-1 rounded mt-3 w-fit text-gray-300 font-bold border border-white/5">Total active hours</div>
                                    </div>
                                </div>

                                {/* Walk History */}
                                <div className="glass rounded-2xl p-6 relative overflow-hidden group hover:border-lime-400/30 hover:bg-white/[0.04] transition-all shadow-lg hover:-translate-y-1">
                                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 text-lime-400"><Activity size={48} /></div>
                                    <div className="relative z-10">
                                        <div className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><Activity size={12}/> Walk History</div>
                                        <div className="text-2xl font-black italic tracking-tighter text-lime-400">{selectedUser.walkHistory}</div>
                                        <div className="text-[10px] bg-lime-400/10 px-2 py-1 rounded mt-3 w-fit text-lime-400/80 font-bold border border-lime-400/10">Total Steps: {selectedUser.totalSteps}</div>
                                    </div>
                                </div>

                                {/* Group */}
                                <div className="glass rounded-2xl p-6 relative overflow-hidden group hover:border-purple-400/30 hover:bg-white/[0.04] transition-all shadow-lg hover:-translate-y-1">
                                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300 text-purple-400"><Users size={48} /></div>
                                    <div className="relative z-10">
                                        <div className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><Users size={12}/> Assigned Group</div>
                                        <div className="text-xl font-bold truncate tracking-tight">{selectedUser.group}</div>
                                        <div className="text-[10px] bg-purple-400/10 text-purple-300 px-2 py-1 rounded mt-3 w-fit font-bold border border-purple-400/20">Active Member</div>
                                    </div>
                                </div>

                                {/* Payment History */}
                                <div className="glass rounded-2xl p-6 relative overflow-hidden group hover:border-amber-400/30 hover:bg-white/[0.04] transition-all shadow-lg md:col-span-2 lg:col-span-1 hover:-translate-y-1">
                                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-300 text-amber-400 group-hover:rotate-12"><CreditCard size={48} /></div>
                                    <div className="relative z-10">
                                        <div className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><CreditCard size={12}/> Payment History</div>
                                        <div className="text-xl font-bold text-white tracking-tight">{selectedUser.paymentHistory}</div>
                                        <div className="flex items-center gap-2 mt-4">
                                            <span className="text-[10px] bg-amber-400/10 text-amber-300 px-2 py-1 rounded font-bold border border-amber-400/20">Premium Plan</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Post Date */}
                                <div className="glass rounded-2xl p-6 relative overflow-hidden group hover:border-blue-400/30 hover:bg-white/[0.04] transition-all shadow-lg hover:-translate-y-1">
                                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300 text-blue-400"><FileText size={48} /></div>
                                    <div className="relative z-10">
                                        <div className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><FileText size={12}/> Last Post Date</div>
                                        <div className="text-2xl font-black italic tracking-tighter">{selectedUser.postDate}</div>
                                        <div className="text-[10px] bg-blue-400/10 text-blue-300 px-2 py-1 rounded mt-3 w-fit font-bold border border-blue-400/20">Latest Activity</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
