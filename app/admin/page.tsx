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
    CheckCircle2,
    ArrowUpRight,
    Calendar,
    Image as ImageIcon,
    Trash2,
    TrendingUp
} from 'lucide-react';
import { getAdminDashboard, getAllUsers, getUserDetails, getAllGroups, getGroupMembers, getAllPosts, deletePost } from '../service/allApi';

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
    const [view, setView] = useState('users'); // 'users', 'admin', 'groups', or 'posts'
    const [searchTerm, setSearchTerm] = useState('');
    const [userFilter, setUserFilter] = useState('All'); // 'All', 'Paid', 'Unpaid'
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [selectedUserDetails, setSelectedUserDetails] = useState<any>(null);
    const [selectedGroup, setSelectedGroup] = useState<any>(null);
    const [groupMembers, setGroupMembers] = useState<any[]>([]);
    const [isLoadingGroupMembers, setIsLoadingGroupMembers] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [dashboardData, setDashboardData] = useState({
        total_users: 0,
        total_groups: 0,
        total_paid_users: 0,
        total_unpaid_users: 0
    });
    const [groups, setGroups] = useState<any[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(false);
    const [isDeletingPost, setIsDeletingPost] = useState<number | null>(null);
    const [postToDelete, setPostToDelete] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if (typeof window !== 'undefined') {
            const role = localStorage.getItem('userRole');
            if (role !== 'Admin') {
                router.push('/dashboard');
                return;
            }
        }

        const fetchData = async () => {
            setError(null);
            setIsLoading(true);
            try {
                // Fetch Dashboard Metrics
                const dashRes = await getAdminDashboard();
                if (dashRes && dashRes.success !== false) {
                    const metrics = dashRes.data || dashRes;
                    setDashboardData({
                        total_users: metrics.total_users ?? metrics.data?.total_users ?? 0,
                        total_groups: metrics.total_groups ?? metrics.data?.total_groups ?? 0,
                        total_paid_users: metrics.total_paid_users ?? metrics.data?.total_paid_users ?? 0,
                        total_unpaid_users: metrics.total_unpaid_users ?? metrics.data?.total_unpaid_users ?? 0
                    });
                }

                // Fetch Users List
                const usersRes = await getAllUsers();
                if (usersRes && usersRes.success !== false) {
                    // API specifically returns users array in the 'users' key
                    const rawUsers = Array.isArray(usersRes.users) ? usersRes.users :
                        Array.isArray(usersRes.data) ? usersRes.data :
                            Array.isArray(usersRes) ? usersRes : [];
                    setUsers(rawUsers);
                }

                // Fetch Groups
                const groupsRes = await getAllGroups();
                if (groupsRes && groupsRes.success !== false) {
                    const rawGroups = Array.isArray(groupsRes.groups) ? groupsRes.groups :
                        Array.isArray(groupsRes.data) ? groupsRes.data :
                            Array.isArray(groupsRes) ? groupsRes : [];
                    setGroups(rawGroups);
                }
            } catch (err) {
                console.error('Error fetching admin data:', err);
                setError('Failed to load system data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [router]);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!selectedUser?.id) return;

            setIsLoadingDetails(true);
            setSelectedUserDetails(null);
            try {
                const res = await getUserDetails(selectedUser.id);
                if (res && res.status) {
                    setSelectedUserDetails(res);
                }
            } catch (err) {
                console.error('Error fetching user details:', err);
            } finally {
                setIsLoadingDetails(false);
            }
        };

        fetchDetails();
    }, [selectedUser]);

    useEffect(() => {
        const fetchGroupMembers = async () => {
            if (!selectedGroup?.id) return;

            setIsLoadingGroupMembers(true);
            setGroupMembers([]);
            try {
                const res = await getGroupMembers(selectedGroup.id);
                if (res && res.success !== false) {
                    const rawMembers = Array.isArray(res.members) ? res.members : 
                                    Array.isArray(res.data) ? res.data : 
                                    Array.isArray(res) ? res : [];
                    setGroupMembers(rawMembers);
                }
            } catch (err) {
                console.error('Error fetching group members:', err);
            } finally {
                setIsLoadingGroupMembers(false);
            }
        };

        fetchGroupMembers();
    }, [selectedGroup]);

    useEffect(() => {
        const fetchPosts = async () => {
            if (view !== 'posts') return;

            setIsLoadingPosts(true);
            try {
                const res = await getAllPosts();
                if (res && res.status === true) {
                    setPosts(res.posts || []);
                }
            } catch (err) {
                console.error('Error fetching posts:', err);
            } finally {
                setIsLoadingPosts(false);
            }
        };

        fetchPosts();
    }, [view]);

    const handleDeletePost = (postId: number) => {
        setPostToDelete(postId);
    };

    const confirmDelete = async () => {
        if (!postToDelete) return;
        
        setIsDeletingPost(postToDelete);
        try {
            const res = await deletePost(postToDelete);
            // Assuming the API returns a success status. If it throws on failure, this is fine.
            setPosts(posts.filter((post) => post.post_id !== postToDelete));
            setPostToDelete(null);
        } catch (err) {
            console.error('Error deleting post:', err);
            alert('Failed to delete the post. Please try again.');
        } finally {
            setIsDeletingPost(null);
        }
    };

    const filteredUsers = users.filter(user => {
        const displayName = user.username || user.name || user.email || '';
        const matchesSearch = displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = userFilter === 'All' ? true :
            userFilter === 'Paid' ? user.payment_status === true || user.payment_status === 1 :
                user.payment_status === false || user.payment_status === 0;

        return matchesSearch && matchesFilter;
    });

    const filteredPosts = posts.filter(post => {
        const contentMatch = post.content?.toLowerCase().includes(searchTerm.toLowerCase());
        const userMatch = post.user?.username?.toLowerCase().includes(searchTerm.toLowerCase());
        return contentMatch || userMatch;
    });

    const resolveImageUrl = (path: string) => {
        if (!path) return null;
        
        // Fix double storage in full URLs returned by backend
        if (path.startsWith('http')) {
            return path.replace('/storage/storage/', '/storage/');
        }
        
        const baseUrl = 'https://api.easycoders.in/projects/shift_backend/public';
        
        let finalPath = path.startsWith('/') ? path.slice(1) : path;
        
        // Fix double storage if provided in relative path
        finalPath = finalPath.replace(/^storage\/storage\//, 'storage/');
        
        // Ensure path starts with storage/ if it looks like a relative storage path
        if (!finalPath.startsWith('storage/')) {
            finalPath = `storage/${finalPath}`;
        }
        
        return `${baseUrl}/${finalPath}`;
    };

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
                    {/* <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 ml-2">Console</p> */}
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
                    <button
                        onClick={() => setView('groups')}
                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${view === 'groups' ? 'bg-lime-400 text-black font-bold shadow-[0_0_30px_rgba(163,230,53,0.3)] scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/5 hover:scale-[1.02]'}`}
                    >
                        <Layers size={20} className={view === 'groups' ? 'text-black' : ''} />
                        <span>Groups</span>
                    </button>
                    <button
                        onClick={() => setView('posts')}
                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${view === 'posts' ? 'bg-lime-400 text-black font-bold shadow-[0_0_30px_rgba(163,230,53,0.3)] scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/5 hover:scale-[1.02]'}`}
                    >
                        <ImageIcon size={20} className={view === 'posts' ? 'text-black' : ''} />
                        <span>Posts</span>
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
                        <h1 className="text-3xl font-black italic tracking-tighter uppercase">
                            {view === 'users' ? 'User Ecosystem' : view === 'admin' ? 'Admin Metrics' : view === 'groups' ? 'Group Network' : 'Content Moderation'}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            {view === 'users' ? 'Monitor, manage and moderate user activities.' : 
                             view === 'admin' ? 'System-wide administrative overview.' : 
                             view === 'groups' ? 'Orchestrate and oversee all active communities.' :
                             'Review and manage user-generated posts across the platform.'}
                        </p>
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
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Shield size={20} />
                                        <span className="font-bold">{error}</span>
                                    </div>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="bg-white/5 hover:bg-white/10 px-4 py-1.5 rounded-xl text-xs font-bold transition-all"
                                    >
                                        Retry
                                    </button>
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                                    <div className="text-5xl font-black italic text-white mb-2">{isLoading ? '...' : dashboardData.total_paid_users.toLocaleString()}</div>
                                    <div className="text-sm font-black text-gray-500 uppercase tracking-widest">Paid Users</div>
                                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-lime-400 bg-lime-400/10 w-fit px-3 py-1 rounded-full">
                                        <TrendingUp size={12} />
                                        <span>+5% this month</span>
                                    </div>
                                </div>

                                {/* Unpaid Users */}
                                <div className="glass-card rounded-3xl p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-red-400/5 rounded-full blur-2xl group-hover:bg-red-400/10 transition-all"></div>
                                    <Shield className="text-red-400 mb-6" size={32} />
                                    <div className="text-5xl font-black italic text-white mb-2">{isLoading ? '...' : dashboardData.total_unpaid_users.toLocaleString()}</div>
                                    <div className="text-sm font-black text-gray-500 uppercase tracking-widest">Unpaid Users</div>
                                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-red-400 bg-red-400/10 w-fit px-3 py-1 rounded-full">
                                        <Activity size={12} />
                                        <span>Action Required</span>
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
                    ) : view === 'groups' ? (
                        <div className="max-w-7xl mx-auto animate-slide-up">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                <div>
                                    <h2 className="text-2xl font-black italic uppercase tracking-tight text-white">Active Communities</h2>
                                    <p className="text-gray-500 text-sm mt-1">Found {groups.length} active groups in the ecosystem.</p>
                                </div>
                                <button className="flex items-center gap-2 bg-lime-400 text-black px-5 py-2.5 rounded-xl font-bold transition-all shadow-xl hover:shadow-lime-400/20 active:scale-95">
                                    <Layers size={18} />
                                    <span className="text-sm uppercase tracking-wider">Create New Group</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {groups.map((group, idx) => (
                                    <div 
                                        key={group.id} 
                                        onClick={() => setSelectedGroup(group)}
                                        className="glass-card rounded-[2.5rem] p-6 relative overflow-hidden group hover:-translate-y-2 transition-all duration-500 animate-fade-in cursor-pointer"
                                        style={{ animationDelay: `${idx * 0.1}s` }}
                                    >
                                        <div className="absolute top-0 right-0 p-10 bg-lime-400/5 rounded-bl-[5rem] translate-x-4 -translate-y-4 group-hover:bg-lime-400/10 transition-all duration-500"></div>
                                        
                                        <div className="relative z-10">
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-lime-400/50 transition-all duration-500 shadow-2xl mb-6">
                                                {group.image ? (
                                                    <img src={resolveImageUrl(group.image) || ''} alt={group.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                ) : (
                                                    <div className="w-full h-full bg-white/5 flex items-center justify-center text-2xl">👥</div>
                                                )}
                                            </div>

                                            <h3 className="text-xl font-black italic tracking-tight text-white mb-2 group-hover:text-lime-400 transition-colors uppercase truncate">{group.name}</h3>
                                            <p className="text-gray-500 text-xs font-medium line-clamp-2 leading-relaxed mb-6 h-8 italic">"{group.description || 'No description provided.'}"</p>
                                            
                                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex -space-x-1.5">
                                                        {[...Array(3)].map((_, i) => (
                                                            <div key={i} className="w-6 h-6 rounded-full border-2 border-gray-950 bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-400">👤</div>
                                                        ))}
                                                    </div>
                                                    <span className="text-[10px] font-black text-lime-400 uppercase tracking-widest">{group.total_members} Members</span>
                                                </div>
                                                <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">#{group.id}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {groups.length === 0 && (
                                <div className="p-20 text-center glass rounded-[2rem] border border-dashed border-white/10 mt-10">
                                    <Layers size={48} className="mx-auto text-gray-700 mb-4 opacity-20" />
                                    <p className="text-gray-500 font-bold italic tracking-tighter">No groups detected in the system.</p>
                                </div>
                            )}
                        </div>
                    ) : view === 'users' ? (
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
                                                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:border-lime-400/30 transition-all duration-300 shadow-md overflow-hidden">
                                                                {user.image ? (
                                                                    <img src={resolveImageUrl(user.image) || ''} alt="" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <span>👤</span>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold flex items-center gap-2 text-white group-hover:text-lime-400 transition-colors">
                                                                    {user.username || user.name || 'Anonymous'}
                                                                </div>
                                                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                                    <Mail size={10} />
                                                                    {user.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg w-fit ${user.role === 'admin' ? 'bg-lime-400/10 text-lime-400 border border-lime-400/20' : 'bg-white/5 text-gray-400 border border-white/5'}`}>
                                                            {user.role}
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.5)]' : 'bg-gray-600'}`}></div>
                                                            <span className="text-sm font-bold text-gray-300">{user.is_active ? 'Active' : 'Inactive'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-2">
                                                            {user.payment_status ? (
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
                    ) : view === 'posts' ? (
                        <div className="max-w-7xl mx-auto animate-slide-up">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                <div>
                                    <h2 className="text-2xl font-black italic uppercase tracking-tight text-white">Community Content</h2>
                                    <p className="text-gray-500 text-sm mt-1">{posts.length} posts actively monitored.</p>
                                </div>
                                <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl font-bold transition-all border border-white/10 hover:border-white/20 shadow-xl" onClick={() => {
                                    /* Force refresh */
                                    setIsLoadingPosts(true);
                                    getAllPosts().then(res => {
                                        if (res && res.status === true) {
                                            setPosts(res.posts || []);
                                        }
                                        setIsLoadingPosts(false);
                                    });
                                }}>
                                    <Clock size={18} />
                                    <span className="text-sm">Refresh Feed</span>
                                </button>
                            </div>

                            {isLoadingPosts ? (
                                <div className="flex flex-col items-center justify-center p-20 gap-4">
                                    <div className="w-12 h-12 border-4 border-lime-400/20 border-t-lime-400 rounded-full animate-spin"></div>
                                    <p className="text-gray-500 font-bold italic tracking-tighter">Loading all posts...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredPosts.map((post, idx) => (
                                        <div 
                                            key={post.post_id} 
                                            className="glass-card rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-500 animate-fade-in flex flex-col h-full relative"
                                            style={{ animationDelay: `${idx * 0.05}s` }}
                                        >
                                            {/* Media */}
                                            <div className="h-48 w-full bg-gray-900 border-b border-white/10 relative overflow-hidden shrink-0">
                                                {post.media_url ? (
                                                    <img src={resolveImageUrl(post.media_url) || ''} alt="Post media" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-700 font-bold italic text-sm">No Media</div>
                                                )}
                                                
                                                {/* Delete Overlay Button */}
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeletePost(post.post_id);
                                                    }}
                                                    disabled={isDeletingPost === post.post_id}
                                                    className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-red-500/80 backdrop-blur-md rounded-xl text-white transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-10 opacity-0 group-hover:opacity-100"
                                                    title="Delete Post"
                                                >
                                                    {isDeletingPost === post.post_id ? (
                                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    ) : (
                                                        <Trash2 size={16} />
                                                    )}
                                                </button>
                                            </div>

                                            {/* Content */}
                                            <div className="p-5 flex-1 flex flex-col">
                                                {/* Author */}
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-8 h-8 rounded-full bg-white/5 overflow-hidden shrink-0 border border-white/10">
                                                        {post.user?.image ? (
                                                            <img src={resolveImageUrl(post.user.image) || ''} alt={post.user.username} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-xs">👤</div>
                                                        )}
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <div className="text-sm font-bold text-white truncate group-hover:text-lime-400 transition-colors">
                                                            {post.user?.username || 'Unknown User'}
                                                        </div>
                                                        <div className="text-[10px] text-gray-500 truncate">
                                                            {new Date(post.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Text Content */}
                                                <p className="text-gray-300 text-sm mb-4 line-clamp-3 overflow-hidden flex-1 group-hover:text-white transition-colors">
                                                    {post.content || <span className="text-gray-600 italic">No text content</span>}
                                                </p>

                                                {/* Stats Footer */}
                                                <div className="pt-4 mt-auto border-t border-white/5 flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider">
                                                    <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                                                        <span className="text-lime-400">♥</span> {post.like_count}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                                                        <span className="text-blue-400">💬</span> {post.comment_count}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                                                        <span className="text-purple-400">↗</span> {post.share_count}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!isLoadingPosts && filteredPosts.length === 0 && (
                                <div className="p-20 text-center glass rounded-[2rem] border border-dashed border-white/10 mt-10">
                                    <ImageIcon size={48} className="mx-auto text-gray-700 mb-4 opacity-20" />
                                    <p className="text-gray-500 font-bold italic tracking-tighter">No posts found.</p>
                                </div>
                            )}
                        </div>
                    ) : null}
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

                                <div className="w-32 h-32 rounded-3xl glass-card flex items-center justify-center text-6xl border border-lime-400/30 shadow-[0_0_40px_rgba(163,230,53,0.15)] relative overflow-hidden">
                                    {selectedUser.image ? (
                                        <img src={resolveImageUrl(selectedUser.image) || ''} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <span>👤</span>
                                    )}
                                </div>
                                <div className="text-center md:text-left flex-1 relative z-10">
                                    <div className="flex flex-col items-center md:items-start">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-4xl font-black italic tracking-tight">{selectedUser.username || selectedUser.name || 'Anonymous User'}</h2>
                                            <div className={`w-3 h-3 rounded-full ${selectedUser.is_active ? 'bg-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.6)]' : 'bg-gray-600'}`}></div>
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
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md ${selectedUser.payment_status ? 'bg-lime-400/10 border border-lime-400/30 text-lime-400' : 'bg-white/5 border border-white/10 text-gray-400'}`}>
                                            <CreditCard size={14} />
                                            {selectedUser.payment_status ? 'Paid Member' : 'Unpaid User'}
                                        </div>
                                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-300 shadow-md">
                                            <Calendar size={14} className="text-blue-400" />
                                            Joined {new Date(selectedUser.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                <div className="space-y-12">
                                    {/* Stats Grid */}
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                        <span>User Activity</span>
                                        <span className="text-lime-400">& Logs</span>
                                        <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                                    </h3>

                                    {isLoadingDetails ? (
                                        <div className="flex flex-col items-center justify-center p-20 gap-4">
                                            <div className="w-12 h-12 border-4 border-lime-400/20 border-t-lime-400 rounded-full animate-spin"></div>
                                            <p className="text-gray-500 font-bold italic tracking-tighter">Retrieving user ledger...</p>
                                        </div>
                                    ) : selectedUserDetails ? (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                                                {/* Today Steps */}
                                                <div className="glass rounded-2xl p-6 relative overflow-hidden group hover:border-lime-400/30 hover:bg-white/5 transition-all shadow-lg hover:-translate-y-1">
                                                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300 text-lime-400"><Clock size={48} /></div>
                                                    <div className="relative z-10">
                                                        <div className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><Clock size={12} /> Today's Steps</div>
                                                        <div className="text-2xl font-black italic tracking-tighter text-white">{selectedUserDetails.today_steps || 0}</div>
                                                        <div className="text-[10px] bg-white/10 px-2 py-1 rounded mt-3 w-fit text-gray-300 font-bold border border-white/5">Daily Target: 10,000</div>
                                                    </div>
                                                </div>

                                                {/* Verification Status */}
                                                <div className="glass rounded-2xl p-6 relative overflow-hidden group hover:border-lime-400/30 hover:bg-white/5 transition-all shadow-lg hover:-translate-y-1">
                                                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300 text-lime-400"><Shield size={48} /></div>
                                                    <div className="relative z-10">
                                                        <div className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><Shield size={12} /> Verification Status</div>
                                                        <div className="text-2xl font-black italic tracking-tighter text-white">{selectedUserDetails.user_detail.email_verification_status ? 'Verified' : 'Unverified'}</div>
                                                        <div className="text-[10px] bg-white/10 px-2 py-1 rounded mt-3 w-fit text-gray-300 font-bold border border-white/5">Auth Level 1</div>
                                                    </div>
                                                </div>

                                                {/* Role */}
                                                <div className="glass rounded-2xl p-6 relative overflow-hidden group hover:border-orange-400/30 hover:bg-white/[0.04] transition-all shadow-lg hover:-translate-y-1">
                                                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 text-orange-400"><Mail size={48} /></div>
                                                    <div className="relative z-10">
                                                        <div className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><Mail size={12} /> User Role</div>
                                                        <div className="text-2xl font-black italic tracking-tighter text-white uppercase">{selectedUserDetails.user_detail.role}</div>
                                                        <div className="text-[10px] bg-orange-400/10 px-2 py-1 rounded mt-3 w-fit text-orange-400 font-bold border border-orange-400/20">System Access</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                                {/* Groups Section */}
                                                <div className="space-y-6">
                                                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                        <Users size={14} className="text-lime-400" /> Group Memberships
                                                    </h4>
                                                    <div className="glass rounded-4xl overflow-hidden border border-white/5">
                                                        {selectedUserDetails.groups && selectedUserDetails.groups.length > 0 ? (
                                                            <div className="divide-y divide-white/5">
                                                                {selectedUserDetails.groups.map((g: any) => {
                                                                    const groupInfo = g.group || groups.find(group => group.id === g.group_id || group.id === Number(g.group_id));
                                                                    return (
                                                                        <div key={g.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lime-400 font-black italic overflow-hidden">
                                                                                    {groupInfo?.image ? (
                                                                                        <img src={resolveImageUrl(groupInfo.image) || ''} alt="" className="w-full h-full object-cover" />
                                                                                    ) : (
                                                                                        <span>#{g.group_id}</span>
                                                                                    )}
                                                                                </div>
                                                                                <div>
                                                                                    <div className="text-sm font-bold text-white">{groupInfo?.name || `Group ${g.group_id}`}</div>
                                                                                    <div className="text-[10px] text-gray-500">{g.is_admin ? 'Group Admin' : 'Member'}</div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="text-[10px] text-gray-600 italic">
                                                                                Joined {new Date(g.created_at).toLocaleDateString()}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        ) : (
                                                            <div className="p-10 text-center text-gray-600 text-xs font-bold italic">No groups assigned.</div>
                                                        )}
                                                    </div>

                                                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 pt-4">
                                                        <Activity size={14} className="text-blue-400" /> Walk History
                                                    </h4>
                                                    <div className="glass rounded-[2rem] overflow-hidden border border-white/5 max-h-[250px] overflow-y-auto">
                                                        {selectedUserDetails.walk_history && selectedUserDetails.walk_history.length > 0 ? (
                                                            <div className="divide-y divide-white/5">
                                                                {selectedUserDetails.walk_history.map((h: any, i: number) => (
                                                                    <div key={i} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                                                        <div className="text-sm font-bold text-gray-300">{new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="text-lg font-black italic tracking-tight text-lime-400">{h.total_steps}</div>
                                                                            <div className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">Steps</div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="p-10 text-center text-gray-600 text-xs font-bold italic">No steps recorded.</div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Payments Section */}
                                                <div className="space-y-6">
                                                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                        <CreditCard size={14} className="text-amber-400" /> Payment Ledger
                                                    </h4>
                                                    <div className="glass rounded-4xl overflow-hidden border border-white/5">
                                                        {selectedUserDetails.payment_history && selectedUserDetails.payment_history.length > 0 ? (
                                                            <div className="divide-y divide-white/5">
                                                                {selectedUserDetails.payment_history.map((p: any) => (
                                                                    <div key={p.id} className="p-5 hover:bg-white/5 transition-colors">
                                                                        <div className="flex justify-between items-start mb-2">
                                                                            <div className="text-sm font-black italic tracking-tight text-white">{p.amount} {p.currency}</div>
                                                                            <div className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${p.status === 'success' ? 'bg-lime-400/10 border-lime-400/20 text-lime-400' : 'bg-red-400/10 border-red-400/20 text-red-400'}`}>
                                                                                {p.status}
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex justify-between items-end">
                                                                            <div>
                                                                                <div className="text-[10px] text-gray-600 font-mono">ID: {p.stripe_session_id.substring(0, 15)}...</div>
                                                                                <div className="text-[10px] text-gray-500 mt-1">Expiry: {new Date(p.expire_date).toLocaleDateString()}</div>
                                                                            </div>
                                                                            <div className="text-[10px] text-gray-600 italic">
                                                                                {new Date(p.created_at).toLocaleDateString()}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="p-10 text-center text-gray-600 text-xs font-bold italic">No payment history.</div>
                                                        )}
                                                    </div>

                                                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 pt-4">
                                                        <FileText size={14} className="text-purple-400" /> Community Posts
                                                    </h4>
                                                    <div className="glass rounded-[2rem] overflow-hidden border border-white/5">
                                                        {(() => {
                                                            const userPosts = Array.isArray(selectedUserDetails?.community_post?.posts) 
                                                                ? selectedUserDetails.community_post.posts 
                                                                : Array.isArray(selectedUserDetails?.community_post)
                                                                    ? selectedUserDetails.community_post
                                                                    : Array.isArray(selectedUserDetails?.posts)
                                                                        ? selectedUserDetails.posts
                                                                        : [];

                                                            return userPosts.length > 0 ? (
                                                                <div className="p-6 grid grid-cols-4 gap-4">
                                                                    {userPosts.map((post: any) => (
                                                                        <div key={post.id || post.post_id} className="aspect-square bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-xs font-bold text-gray-600 hover:border-purple-400/30 hover:text-purple-400 transition-all cursor-default overflow-hidden group/post relative">
                                                                            {post.image || post.photo || post.url || post.media_url ? (
                                                                                <img src={resolveImageUrl(post.image || post.photo || post.url || post.media_url) || ''} alt="" className="w-full h-full object-cover group-hover/post:scale-110 transition-transform duration-500" />
                                                                            ) : (
                                                                                <div className="p-2 text-center break-words w-full line-clamp-3">
                                                                                    {post.content ? `"${post.content}"` : `#${post.post_id || post.id}`}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <div className="p-10 text-center text-gray-600 text-xs font-bold italic">No community posts yet.</div>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="p-20 text-center text-gray-600 text-xs font-bold italic">Select a user to view their records.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                {/* Group Detail Modal */}
                {selectedGroup && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 md:p-8">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in" onClick={() => setSelectedGroup(null)}></div>

                        <div className="relative w-full max-w-4xl max-h-full overflow-y-auto glass-card rounded-[2.5rem] p-8 md:p-10 animate-scale-in border border-white/10 shadow-2xl flex flex-col">
                            {/* Close btn */}
                            <button
                                onClick={() => setSelectedGroup(null)}
                                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5 z-10 shadow-lg hover:scale-110"
                            >
                                <X size={24} />
                            </button>

                            {/* Header */}
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 border-b border-white/10 pb-10 relative shrink-0">
                                <div className="absolute -top-10 -left-10 w-40 h-40 bg-lime-400/10 rounded-full blur-3xl pointer-events-none"></div>

                                <div className="w-32 h-32 rounded-3xl glass-card flex items-center justify-center text-6xl border border-lime-400/30 shadow-[0_0_40px_rgba(163,230,53,0.15)] relative overflow-hidden shrink-0">
                                    {selectedGroup.image ? (
                                        <img src={resolveImageUrl(selectedGroup.image) || ''} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <span>👥</span>
                                    )}
                                </div>
                                <div className="text-center md:text-left flex-1 relative z-10">
                                    <div className="flex flex-col items-center md:items-start">
                                        <h2 className="text-4xl font-black italic tracking-tight uppercase text-white mb-2">{selectedGroup.name}</h2>
                                        <p className="text-gray-400 text-sm font-medium italic">"{selectedGroup.description || 'No description provided.'}"</p>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6">
                                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-300 shadow-md">
                                            <Users size={14} className="text-lime-400" />
                                            {selectedGroup.total_members} Members
                                        </div>
                                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-300 shadow-md">
                                            <Calendar size={14} className="text-blue-400" />
                                            Created {new Date(selectedGroup.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3 mb-6">
                                    <span>Group Members</span>
                                    <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                                </h3>

                                {isLoadingGroupMembers ? (
                                    <div className="flex flex-col items-center justify-center p-20 gap-4">
                                        <div className="w-12 h-12 border-4 border-lime-400/20 border-t-lime-400 rounded-full animate-spin"></div>
                                        <p className="text-gray-500 font-bold italic tracking-tighter">Retrieving members list...</p>
                                    </div>
                                ) : groupMembers.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {groupMembers.map((member: any) => {
                                            const u = member.user || member;
                                            return (
                                                <div key={member.id} className="glass rounded-2xl p-4 flex items-center gap-4 hover:bg-white/5 transition-colors group cursor-pointer border border-white/5 hover:border-lime-400/30">
                                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl group-hover:scale-110 group-hover:border-lime-400/30 transition-all shadow-md overflow-hidden shrink-0">
                                                        {u.image ? (
                                                            <img src={resolveImageUrl(u.image) || ''} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span>👤</span>
                                                        )}
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <div className="font-bold flex items-center gap-2 text-white group-hover:text-lime-400 transition-colors truncate">
                                                            {u.username || u.name || 'Anonymous'}
                                                        </div>
                                                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1 truncate">
                                                            <Mail size={10} />
                                                            {u.email}
                                                        </div>
                                                        <div className="mt-2 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md w-fit bg-white/5 text-gray-400 border border-white/5">
                                                            {member.is_admin ? 'Admin' : (u.role || 'Member')}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-20 text-center text-gray-600 text-sm font-bold italic border border-dashed border-white/10 rounded-[2rem] glass">
                                        No members found in this group yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {postToDelete && (
                    <div className="absolute inset-0 z-[60] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setPostToDelete(null)}></div>
                        
                        <div className="relative w-full max-w-md glass-card rounded-[2rem] p-8 animate-scale-in border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)] flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                                <Trash2 size={40} />
                            </div>
                            
                            <h3 className="text-2xl font-black italic uppercase tracking-tight text-white mb-2">Delete Post?</h3>
                            <p className="text-gray-400 font-medium mb-8">This action cannot be undone. Once deleted, this post will be permanently removed from the ecosystem.</p>
                            
                            <div className="flex w-full gap-4">
                                <button 
                                    onClick={() => setPostToDelete(null)}
                                    className="flex-1 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/5 hover:border-white/20 active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={confirmDelete}
                                    disabled={isDeletingPost !== null}
                                    className="flex-1 py-3.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all shadow-lg hover:shadow-red-500/20 active:scale-95 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isDeletingPost !== null ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <Trash2 size={18} /> Delete Now
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                </main>
            </div>
        );
}
