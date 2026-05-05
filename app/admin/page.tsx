'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Toast from '../components/Toast';
import {
    Bell,
    ArrowLeft,
    Users,
    Layers,
    Activity,
    Search,
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
    TrendingUp,
    LayoutList,
    Sun,
    Moon,
    Folder,
    FolderPlus,
    Eye,
    LogOut
} from 'lucide-react';
import { getAdminDashboard, getAllUsers, getUserDetails, searchUsersAdmin, getAllGroups, getGroupMembers, getAllPosts, deletePost, updateUserStatus, getUnpaidAccess, addUnpaidAccess, removeUnpaidAccess, getWorkoutVideos, uploadWorkoutVideo, getVideoDetails, updateVideoStatus, markVideoAsTop, getAdminProfile } from '../service/allApi';
import { resolveImageUrl } from '../service/APIutils';

// --- Mock Data ---

const mockUsers = [
    { id: 1, name: 'Active Jeri', email: 'jeri@shift.com', role: 'Admin', status: 'Online', joinDate: 'Dec 12, 2024', avatar: '🏃', country: '🇬🇧', paymentStatus: 'Paid', walkTime: '120h 45m', walkHistory: '8.5k avg/day', group: 'London Sprinters', paymentHistory: 'GH₵15/mo - Active', postDate: 'Dec 15, 2024', totalSteps: '1.2M' },
    { id: 2, name: 'Bertha', email: 'bertha@shift.com', role: 'User', status: 'Away', joinDate: 'Jan 05, 2025', avatar: '👤', country: '🇬🇭', paymentStatus: 'Unpaid', walkTime: '45h 20m', walkHistory: '3.2k avg/day', group: '-', paymentHistory: 'Free Tier', postDate: 'Jan 10, 2025', totalSteps: '340k' },
    { id: 3, name: 'Lazy Jo', email: 'jo@shift.com', role: 'User', status: 'Offline', joinDate: 'Feb 15, 2025', avatar: '🏃', country: '🇺🇸', paymentStatus: 'Paid', walkTime: '200h 10m', walkHistory: '12k avg/day', group: 'Tech Walkers', paymentHistory: 'GH₵15/mo - Active', postDate: 'Feb 16, 2025', totalSteps: '2.5M' },
    { id: 4, name: 'Swift Runner', email: 'swift@shift.com', role: 'Moderator', status: 'Online', joinDate: 'Mar 01, 2025', avatar: '⚡', country: '🇮🇳', paymentStatus: 'Paid', walkTime: '80h 30m', walkHistory: '15k avg/day', group: 'Global Guardians', paymentHistory: 'GH₵15/mo - Active', postDate: 'Mar 05, 2025', totalSteps: '890k' },
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
    const [theme, setTheme] = useState<'dark' | 'light'>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('adminTheme') as 'dark' | 'light') || 'dark';
        }
        return 'dark';
    });
    const isDark = theme === 'dark';
    const [view, setView] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('adminView') || 'admin';
        }
        return 'admin';
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [userFilter, setUserFilter] = useState('All'); // 'All', 'Paid', 'Unpaid'
    const [postDateFilter, setPostDateFilter] = useState('');
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
    const [adminEmail, setAdminEmail] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userEmail') || localStorage.getItem('verificationEmail') || '';
        }
        return '';
    });
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [isLoadingMenu, setIsLoadingMenu] = useState(false);
    const [workouts, setWorkouts] = useState<any[]>([]);
    const [isLoadingWorkouts, setIsLoadingWorkouts] = useState(false);
    const [workoutSubView, setWorkoutSubView] = useState('library'); // 'library', 'upload', 'analytics'
    const [mounted, setMounted] = useState(false);

    // For upload video
    const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);
    const [isUploadingVideo, setIsUploadingVideo] = useState(false);
    const [newVideoTitle, setNewVideoTitle] = useState('');
    const [newVideoDescription, setNewVideoDescription] = useState('');
    const [newVideoName, setNewVideoName] = useState('');
    const [newVideoDuration, setNewVideoDuration] = useState('');
    const [newVideoFile, setNewVideoFile] = useState<File | null>(null);
    const [newThumbnailFile, setNewThumbnailFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    // For video details
    const [selectedVideo, setSelectedVideo] = useState<any>(null);
    const [selectedVideoDetails, setSelectedVideoDetails] = useState<any>(null);
    const [isLoadingVideoDetails, setIsLoadingVideoDetails] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
    const [videoToMarkTop, setVideoToMarkTop] = useState<any>(null);
    const [isMarkingTop, setIsMarkingTop] = useState(false);

    // Modal closing animation
    const [closingModal, setClosingModal] = useState<string | null>(null);

    // Profile dropdown
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // For add menu
    const [isAddingMenu, setIsAddingMenu] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [accessToRemove, setAccessToRemove] = useState<any>(null);
    const [isRemovingAccess, setIsRemovingAccess] = useState(false);
    const [newMenuId, setNewMenuId] = useState('');
    const [newSubmenuId, setNewSubmenuId] = useState('');
    const [addMenuError, setAddMenuError] = useState<string | null>(null);

    // ── Logout ──────────────────────────────────────────────────────────────
    const handleLogout = useCallback(() => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('verificationEmail');
            localStorage.removeItem('adminView');
            localStorage.removeItem('adminTheme');
        }
        router.replace('/login');
    }, [router]);

    // ── Modal close helpers ──────────────────────────────────────────────────
    const closeModal = useCallback((setter: (v: any) => void, resetFn?: () => void) => {
        setter(null);
        if (resetFn) resetFn();
    }, []);

    // ── ESC key to close any open modal ─────────────────────────────────────
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return;
            if (selectedUser) { setSelectedUser(null); return; }
            if (selectedGroup) { setSelectedGroup(null); return; }
            if (selectedVideo) { setSelectedVideo(null); setSelectedVideoDetails(null); return; }
            if (postToDelete) { setPostToDelete(null); return; }
            if (videoToMarkTop) { setVideoToMarkTop(null); return; }
            if (isAddModalOpen) { setIsAddModalOpen(false); return; }
            if (accessToRemove) { setAccessToRemove(null); return; }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [selectedUser, selectedGroup, selectedVideo, postToDelete, videoToMarkTop, isAddModalOpen, accessToRemove]);

    // Persist theme to localStorage whenever it changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('adminTheme', theme);
        }
    }, [theme]);

    // Persist view to localStorage whenever it changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('adminView', view);
        }
    }, [view]);

    useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('authToken');
            const role = localStorage.getItem('userRole');
            if (!token) {
                router.replace('/login');
                return;
            }
            if (role !== 'Admin') {
                router.replace('/dashboard');
                return;
            }
        }

        // Fetch admin email from API (not localStorage)
        const fetchAdminEmail = async () => {
            try {
                const profileRes = await getAdminProfile();
                const apiEmail =
                    profileRes?.email ||
                    profileRes?.data?.email ||
                    profileRes?.user?.email ||
                    profileRes?.data?.user?.email ||
                    profileRes?.user_data?.email ||
                    null;
                if (apiEmail) {
                    setAdminEmail(apiEmail);
                } else {
                    // fallback to localStorage only if API doesn't return email
                    const stored = localStorage.getItem('userEmail') || localStorage.getItem('verificationEmail') || '';
                    setAdminEmail(stored);
                }
            } catch {
                const stored = localStorage.getItem('userEmail') || localStorage.getItem('verificationEmail') || '';
                setAdminEmail(stored);
            }
        };
        fetchAdminEmail();

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
                    let rawUsers = [];
                    if (Array.isArray(usersRes.users)) rawUsers = usersRes.users;
                    else if (Array.isArray(usersRes.data?.users)) rawUsers = usersRes.data.users;
                    else if (Array.isArray(usersRes.data?.data)) rawUsers = usersRes.data.data;
                    else if (Array.isArray(usersRes.data)) rawUsers = usersRes.data;
                    else if (Array.isArray(usersRes)) rawUsers = usersRes;

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
                // console.error('Error fetching admin data:', err);
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
                // console.error('Error fetching user details:', err);
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
                // console.error('Error fetching group members:', err);
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
                const searchRes = await searchUsersAdmin({
                    search: searchTerm,
                    type: 'posts',
                    date_from: postDateFilter
                });

                if (searchRes && searchRes.success !== false) {
                    let rawPosts = [];
                    if (Array.isArray(searchRes.posts)) rawPosts = searchRes.posts;
                    else if (Array.isArray(searchRes.data?.posts)) rawPosts = searchRes.data.posts;
                    else if (Array.isArray(searchRes.data?.data)) rawPosts = searchRes.data.data;
                    else if (Array.isArray(searchRes.data)) rawPosts = searchRes.data;
                    else if (Array.isArray(searchRes)) rawPosts = searchRes;
                    else if (searchRes.data && typeof searchRes.data === 'object' && !Array.isArray(searchRes.data)) {
                        if (searchRes.data.id || searchRes.data.post_id) {
                            rawPosts = [searchRes.data];
                        }
                    } else if (searchRes.id || searchRes.post_id) {
                        rawPosts = [searchRes];
                    }

                    setPosts(rawPosts);
                }
            } catch (err) {
                // console.error('Error fetching posts:', err);
            } finally {
                setIsLoadingPosts(false);
            }
        };

        const timer = setTimeout(() => {
            fetchPosts();
        }, 400);

        return () => clearTimeout(timer);
    }, [searchTerm, postDateFilter, view]);

    useEffect(() => {
        const fetchMenuItems = async () => {
            if (view !== 'menu') return;
            setIsLoadingMenu(true);
            try {
                const res = await getUnpaidAccess();
                if (res && res.status) {
                    setMenuItems(res.data || []);
                }
            } catch (err) {
                // console.error('Error fetching menu items:', err);
            } finally {
                setIsLoadingMenu(false);
            }
        };

        fetchMenuItems();
    }, [view]);

    useEffect(() => {
        const fetchWorkouts = async () => {
            if (view !== 'workout_setting') return;
            setIsLoadingWorkouts(true);
            try {
                const res = await getWorkoutVideos();
                if (res && res.status) {
                    setWorkouts(res.data || []);
                } else if (Array.isArray(res)) {
                    setWorkouts(res);
                } else if (res && res.data) {
                    setWorkouts(res.data);
                }
            } catch (err) {
                // console.error('Error fetching workout videos:', err);
            } finally {
                setIsLoadingWorkouts(false);
            }
        };

        fetchWorkouts();
    }, [view]);

    useEffect(() => {
        const fetchVideoData = async () => {
            if (!selectedVideo?.uuid && !selectedVideo?.video_id) return;

            setIsLoadingVideoDetails(true);
            setSelectedVideoDetails(null);
            try {
                const res = await getVideoDetails(selectedVideo.uuid || selectedVideo.video_id);
                if (res && res.status) {
                    setSelectedVideoDetails(res.data || res);
                }
            } catch (err) {
                // console.error('Error fetching video details:', err);
            } finally {
                setIsLoadingVideoDetails(false);
            }
        };

        fetchVideoData();
    }, [selectedVideo]);

    const handleAddAccessMenuItem = async () => {
        if (!newMenuId.trim()) return;

        setIsAddingMenu(true);
        setAddMenuError(null);
        try {
            const payload: any = { menu_id: Number(newMenuId) };
            if (newSubmenuId.trim()) payload.submenu_id = Number(newSubmenuId);

            const res = await addUnpaidAccess(payload);
            if (res && res.status) {
                // Refresh list
                const fresh = await getUnpaidAccess();
                if (fresh && fresh.status) {
                    setMenuItems(fresh.data || []);
                }
                setNewMenuId('');
                setNewSubmenuId('');
                setIsAddModalOpen(false);
            } else {
                setAddMenuError('Add failed. Please verify the IDs.');
            }
        } catch (err) {
            // console.error('Error adding new menu item:', err);
            setAddMenuError('Failed to add. Please try again.');
        } finally {
            setIsAddingMenu(false);
        }
    };

    const handleRemoveAccessMenuItem = async (item: any) => {
        setIsRemovingAccess(true);
        try {
            const payload: any = { menu_id: item.menu_id };
            if (item.id) payload.id = item.id;
            if (item.submenu_id) payload.submenu_id = item.submenu_id;

            const res = await removeUnpaidAccess(payload);
            if (res && res.status) {
                setMenuItems(prev => prev.filter(i => i.id !== item.id));
                setAccessToRemove(null);
            } else {
                alert('Remove failed.');
            }
        } catch (err) {
            // console.error('Error removing new menu item:', err);
            alert('Failed to remove.');
        } finally {
            setIsRemovingAccess(false);
        }
    };

    const handleDeletePost = (postId: number) => {
        setPostToDelete(postId);
    };

    const handleStatusChange = async (user: any, newStatus: 0 | 1) => {
        // Optimistically update UI
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, account_is_active: newStatus, is_active: newStatus === 1 } : u));
        try {
            await updateUserStatus(user.id, newStatus);
        } catch (err) {
            // console.error('Failed to update user status:', err);
            // Revert on failure
            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, account_is_active: user.account_is_active, is_active: user.is_active } : u));
        }
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
            // console.error('Error deleting post:', err);
            alert('Failed to delete the post. Please try again.');
        } finally {
            setIsDeletingPost(null);
        }
    };

    const handleVideoStatusUpdate = async (uuid: string, status: 'published' | 'archived') => {
        setIsUpdatingStatus(status);
        try {
            const res = await updateVideoStatus(uuid, status);
            if (res && res.status) {
                setToast({ message: `Video ${status} successfully!`, type: 'success' });
                // Update local state
                if (selectedVideoDetails && (selectedVideoDetails.uuid === uuid || selectedVideoDetails.video_id === uuid)) {
                    setSelectedVideoDetails({ ...selectedVideoDetails, status });
                }
                setWorkouts(prev => prev.map(v => (v.uuid === uuid || v.video_id === uuid) ? { ...v, status } : v));
            } else {
                setToast({ message: res?.message || 'Status update failed', type: 'error' });
            }
        } catch (err) {
            setToast({ message: 'Error updating video status', type: 'error' });
        } finally {
            setIsUpdatingStatus(null);
        }
    };

    const handleMarkAsTop = async () => {
        if (!videoToMarkTop) return;
        setIsMarkingTop(true);
        try {
            const uuid = videoToMarkTop.uuid || videoToMarkTop.video_id;
            const res = await markVideoAsTop(uuid);
            if (res && res.status) {
                setToast({ message: 'Video marked as top successfully!', type: 'success' });
                // Update local state
                if (selectedVideoDetails && (selectedVideoDetails.uuid === uuid || selectedVideoDetails.video_id === uuid)) {
                    setSelectedVideoDetails({ ...selectedVideoDetails, is_top: 1 });
                }
                setWorkouts(prev => prev.map(v => (v.uuid === uuid || v.video_id === uuid) ? { ...v, is_top: 1 } : v));
                setVideoToMarkTop(null);
            } else {
                setToast({ message: res?.message || 'Failed to mark as top', type: 'error' });
            }
        } catch (err) {
            setToast({ message: 'Error marking video as top', type: 'error' });
        } finally {
            setIsMarkingTop(false);
        }
    };

    const handleUploadVideo = async () => {
        if (!newVideoTitle.trim() || !newVideoDescription.trim() || !newVideoName.trim() || !newVideoDuration.trim() || !newVideoFile || !newThumbnailFile) {
            setUploadError('Please fill all fields and select both video and thumbnail.');
            return;
        }

        setIsUploadingVideo(true);
        setUploadError(null);
        try {
            const res = await uploadWorkoutVideo({
                title: newVideoTitle,
                description: newVideoDescription,
                video_name: newVideoName,
                duration: newVideoDuration,
                video: newVideoFile,
                thumbnail: newThumbnailFile
            });

            if (res && (res.status === true || res.success !== false)) {
                setToast({ message: 'Workout video published successfully!', type: 'success' });

                // Refresh videos
                const fresh = await getWorkoutVideos();
                if (fresh) {
                    const raw = fresh.data || fresh;
                    setWorkouts(Array.isArray(raw) ? raw : []);
                }

                // Reset form
                setNewVideoTitle('');
                setNewVideoDescription('');
                setNewVideoName('');
                setNewVideoDuration('');
                setNewVideoFile(null);
                setNewThumbnailFile(null);
                // Keep form open so user can see the new video added "under"
            } else {
                setUploadError(res.message || 'Upload failed.');
                setToast({ message: res.message || 'Upload failed', type: 'error' });
            }
        } catch (err) {
            setUploadError('Failed to upload video. Please try again.');
            setToast({ message: 'Server error during upload', type: 'error' });
        } finally {
            setIsUploadingVideo(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const displayName = user.username || user.name || user.email || '';
        const matchesSearch = displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = userFilter === 'All' ? true :
            userFilter === 'Paid' ? user.payment_status === true || user.payment_status === 1 :
                user.payment_status === false || user.payment_status === 0;

        return matchesSearch && matchesFilter;
    });

    const filteredGroups = groups.filter(group => {
        const nameMatch = group.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const descMatch = group.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || descMatch;
    });

    const filteredPosts = posts;


    // Theme-aware class helpers
    const bg = isDark ? 'bg-gray-950' : 'bg-gray-50';
    const text = isDark ? 'text-white' : 'text-gray-950';
    const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
    const textSub = isDark ? 'text-gray-500' : 'text-gray-400';
    const borderColor = isDark ? 'border-white/5' : 'border-gray-200';
    const glassBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.85)';
    const glassBorder = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)';
    const glassCardBgFrom = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.95)';
    const glassCardBgTo = isDark ? 'rgba(255,255,255,0.01)' : 'rgba(249,250,251,0.95)';
    const glassCardBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
    const scrollThumb = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.15)';
    const inputBg = isDark ? 'bg-black/40' : 'bg-white';
    const inputBorder = isDark ? 'border-white/10' : 'border-gray-200';
    const inputText = isDark ? 'text-white' : 'text-gray-900';
    const rowHover = isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-gray-100/70';
    const theadBg = isDark ? 'bg-white/[0.02]' : 'bg-gray-100/60';
    const divideColor = isDark ? 'divide-white/5' : 'divide-gray-200';
    const sidebarBtnActive = 'bg-lime-400 text-black font-bold shadow-[0_0_30px_rgba(163,230,53,0.3)] scale-[1.02]';
    const sidebarBtnInactive = isDark ? `${textMuted} hover:text-white hover:bg-white/5 hover:scale-[1.02]` : `${textMuted} hover:text-gray-900 hover:bg-black/5 hover:scale-[1.02]`;

    if (!mounted) return null; // Prevent hydration mismatch flicker

    return (
        <div className={`min-h-screen ${bg} ${text} font-sans selection:bg-lime-400 selection:text-black flex flex-col md:flex-row h-screen overflow-hidden transition-colors duration-300`}>
            <style jsx global>{`
                .glass {
                    background: ${glassBg};
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid ${glassBorder};
                }
                .glass-card {
                    background: linear-gradient(145deg, ${glassCardBgFrom} 0%, ${glassCardBgTo} 100%);
                    backdrop-filter: blur(20px);
                    border: 1px solid ${glassCardBorder};
                    box-shadow: 0 4px 30px ${isDark ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.05)'};
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
                    background: ${scrollThumb};
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(163, 230, 53, 0.5);
                }
            `}</style>

            {/* Sidebar */}
            <aside className={`hidden md:flex flex-col w-70 h-full glass border-r ${borderColor} shrink-0 z-10`}>
                {/* Logo zone — same height as header */}
                <div className={`flex flex-col  px-5 pt-0 pb-0 border-b ${borderColor} shrink-0`}>
                    <div className="w-40 h-24 relative">
                        <Image src="/logo.png" alt="Logo" fill className={`object-contain transition-all ${!isDark ? 'invert' : ''}`} />
                    </div>
                </div>

                <nav className="flex flex-col gap-3 flex-1 px-8 pt-6">
                    <button
                        onClick={() => { setView('admin'); setSelectedUser(null); setSelectedGroup(null); }}
                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${view === 'admin' ? sidebarBtnActive : sidebarBtnInactive}`}
                    >
                        <Shield size={20} className={view === 'admin' ? 'text-black' : ''} />
                        <span>Dashboard</span>
                    </button>
                    <button
                        onClick={() => { setView('users'); setSelectedUser(null); setSelectedGroup(null); }}
                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${view === 'users' ? sidebarBtnActive : sidebarBtnInactive}`}
                    >
                        <Users size={20} className={view === 'users' ? 'text-black' : ''} />
                        <span>Users</span>
                    </button>

                    <button
                        onClick={() => { setView('groups'); setSelectedUser(null); setSelectedGroup(null); }}
                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${view === 'groups' ? sidebarBtnActive : sidebarBtnInactive}`}
                    >
                        <Layers size={20} className={view === 'groups' ? 'text-black' : ''} />
                        <span>Groups</span>
                    </button>
                    <button
                        onClick={() => { setView('posts'); setSelectedUser(null); setSelectedGroup(null); }}
                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${view === 'posts' ? sidebarBtnActive : sidebarBtnInactive}`}
                    >
                        <ImageIcon size={20} className={view === 'posts' ? 'text-black' : ''} />
                        <span>Posts</span>
                    </button>
                    <button
                        onClick={() => { setView('menu'); setSelectedUser(null); setSelectedGroup(null); }}
                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${view === 'menu' ? sidebarBtnActive : sidebarBtnInactive}`}
                    >
                        <Layers size={20} className={view === 'menu' ? 'text-black' : ''} />
                        <span>Menu Access</span>
                    </button>
                    <button
                        onClick={() => { setView('workout_setting'); setSelectedUser(null); setSelectedGroup(null); }}
                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${view === 'workout_setting' ? sidebarBtnActive : sidebarBtnInactive}`}
                    >
                        <Activity size={20} className={view === 'workout_setting' ? 'text-black' : ''} />
                        <span>WorkOut Setting</span>
                    </button>
                </nav>

                {/* Theme Toggle Section */}
                {/* <div className={`rounded-2xl border ${borderColor} p-4 ${isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]'}`}>
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${textMuted} mb-3`}>Theme</p>
                    <div className={`flex items-center gap-2 p-1 rounded-xl ${isDark ? 'bg-gray-900/60' : 'bg-gray-200/60'}`}>
                        <button
                            onClick={() => setTheme('dark')}
                            className={`flex items-center justify-center gap-2 flex-1 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 ${isDark
                                ? 'bg-gray-800 text-lime-400 shadow-[0_2px_10px_rgba(0,0,0,0.3)] border border-white/10'
                                : `${textMuted} hover:text-gray-700`
                                }`}
                        >
                            <Moon size={14} />
                            <span>Dark</span>
                        </button>
                        <button
                            onClick={() => setTheme('light')}
                            className={`flex items-center justify-center gap-2 flex-1 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 ${!isDark
                                ? 'bg-white text-amber-500 shadow-[0_2px_10px_rgba(0,0,0,0.1)] border border-black/5'
                                : `${textMuted} hover:text-gray-300`
                                }`}
                        >
                            <Sun size={14} />
                            <span>Light</span>
                        </button>
                    </div>
                </div> */}

                {/* Profile Dropdown */}
                <div className="px-5   pb-70 relative">
                    {/* Clickable profile card */}
                    <button
                        onClick={() => setShowProfileMenu(v => !v)}
                        className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${showProfileMenu
                            ? isDark ? 'bg-white/10 border-lime-400/30' : 'bg-black/10 border-lime-400/30'
                            : isDark ? 'bg-white/[0.03] border-white/8 hover:bg-white/8 hover:border-white/15' : 'bg-black/[0.03] border-black/8 hover:bg-black/8 hover:border-black/15'
                            }`}
                    >
                        {/* Avatar circle */}
                        <div className="w-9 h-9 rounded-xl bg-lime-400/20 border border-lime-400/30 flex items-center justify-center shrink-0">
                            <Shield size={16} className="text-lime-400" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                            <div className={`text-[10px] font-black uppercase tracking-widest ${textMuted} mb-0.5`}>Admin</div>
                            <div className={`text-xs font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`} title={adminEmail}>
                                {adminEmail || 'Administrator'}
                            </div>
                        </div>
                        {/* Chevron */}
                        <div className={`transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={textMuted}>
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </div>
                    </button>

                    {/* Dropdown menu */}
                    {showProfileMenu && (
                        <>
                            {/* Backdrop to close on outside click */}
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowProfileMenu(false)}
                            />
                            <div
                                className={`absolute left-5 right-5 bottom-full mb-2 z-50 rounded-2xl border shadow-2xl overflow-hidden animate-fade-in ${isDark
                                    ? 'bg-gray-900 border-white/10 shadow-black/60'
                                    : 'bg-white border-gray-200 shadow-gray-300/60'
                                    }`}
                            >
                                {/* Email header inside dropdown */}
                                <div className={`px-4 py-3 border-b ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-gray-100 bg-gray-50'
                                    }`}>
                                    <div className={`text-[9px] font-black uppercase tracking-widest mb-0.5 ${textMuted}`}>Signed in as</div>
                                    <div className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`} title={adminEmail}>
                                        {adminEmail || 'Administrator'}
                                    </div>
                                </div>

                                {/* Back to App */}
                                <button
                                    onClick={() => { setShowProfileMenu(false); router.push('/dashboard'); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors ${isDark
                                        ? 'text-gray-300 hover:text-white hover:bg-white/5'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                >
                                    <ArrowLeft size={16} />
                                    <span>Back to App</span>
                                </button>

                                {/* Divider */}
                                <div className={isDark ? 'border-t border-white/5' : 'border-t border-gray-100'} />

                                {/* Logout */}
                                <button
                                    onClick={() => { setShowProfileMenu(false); handleLogout(); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-400 hover:text-white hover:bg-red-500/80 transition-colors"
                                >
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header */}
                <header className={`px-6 pt-6 pb-4 md:px-8 md:pt-6 md:pb-4 flex items-center justify-between border-b ${borderColor} glass z-10 shrink-0`}>
                    <div className="flex items-center gap-4 md:hidden">
                        <button onClick={() => router.push('/dashboard')} className="p-2 glass rounded-xl">
                            <ArrowLeft size={20} />
                        </button>
                    </div>
                    <div className="hidden md:block">
                        <h1 className="text-3xl font-black italic tracking-tighter uppercase">
                            {view === 'users' ? 'User Ecosystem' : view === 'admin' ? 'Admin Metrics' : view === 'groups' ? 'Group Network' : view === 'menu' ? 'Menu Access' : view === 'workout_setting' ? 'WorkOut Dynamics' : 'Content Moderation'}
                        </h1>
                        <p className={`${textMuted} text-sm`}>
                            {view === 'users' ? 'Monitor, manage and moderate user activities.' :
                                view === 'admin' ? 'System-wide administrative overview.' :
                                    view === 'groups' ? 'Orchestrate and oversee all active communities.' :
                                        view === 'menu' ? 'Manage accessible menu items and quick actions.' :
                                            view === 'workout_setting' ? 'Configure and manage workout video content.' :
                                                'Review and manage user-generated posts across the platform.'}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className={`hidden sm:flex items-center glass rounded-2xl px-4 py-2.5 gap-3 border ${borderColor} group focus-within:border-lime-400/50 focus-within:shadow-[0_0_15px_rgba(163,230,53,0.1)] transition-all`}>
                            <Search size={18} className={`${textSub} group-focus-within:text-lime-400 transition-colors`} />
                            <input
                                type="text"
                                placeholder="Search details..."
                                className={`bg-transparent border-none outline-none text-sm w-48 font-medium ${isDark ? 'placeholder:text-gray-700' : 'placeholder:text-gray-400'} focus:placeholder:${textMuted}`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {/* Mobile theme toggle */}
                        <button
                            onClick={() => setTheme(isDark ? 'light' : 'dark')}
                            className={`p-3 glass rounded-2xl transition-all group overflow-hidden relative ${isDark ? 'hover:border-amber-400/30' : 'hover:border-gray-900/30'}`}
                            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            <div className="absolute inset-0 bg-lime-400/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                            {isDark ? <Sun size={20} className="group-hover:text-amber-400 relative z-10 transition-colors" /> : <Moon size={20} className="group-hover:text-indigo-400 relative z-10 transition-colors" />}
                        </button>
                        <button className="relative p-3 glass rounded-2xl hover:border-lime-400/30 transition-all group overflow-hidden">
                            <div className="absolute inset-0 bg-lime-400/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                            <Bell size={22} className="group-hover:text-lime-400 relative z-10 transition-colors" />
                            <span className={`absolute top-2.5 right-2.5 w-2 h-2 bg-lime-400 rounded-full border ${isDark ? 'border-gray-950' : 'border-gray-50'} shadow-[0_0_5px_rgba(163,230,53,0.8)] z-10`}></span>
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 relative scroll-smooth">
                    {view === 'admin' ? (
                        <div className="w-full space-y-8 animate-slide-up">
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
                                    <div className={`text-5xl font-black italic ${text} mb-2`}>{isLoading ? '...' : dashboardData.total_users.toLocaleString()}</div>
                                    <div className={`text-sm font-black ${textMuted} uppercase tracking-widest`}>Total Users</div>
                                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-lime-400 bg-lime-400/10 w-fit px-3 py-1 rounded-full">
                                        <TrendingUp size={12} />
                                        <span>+12% this month</span>
                                    </div>
                                </div>

                                {/* Paid Users */}
                                <div className="glass-card rounded-3xl p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-lime-400/5 rounded-full blur-2xl group-hover:bg-lime-400/10 transition-all"></div>
                                    <CreditCard className="text-lime-400 mb-6" size={32} />
                                    <div className={`text-5xl font-black italic ${text} mb-2`}>{isLoading ? '...' : dashboardData.total_paid_users.toLocaleString()}</div>
                                    <div className={`text-sm font-black ${textMuted} uppercase tracking-widest`}>Paid Users</div>
                                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-lime-400 bg-lime-400/10 w-fit px-3 py-1 rounded-full">
                                        <TrendingUp size={12} />
                                        <span>+5% this month</span>
                                    </div>
                                </div>

                                {/* Unpaid Users */}
                                <div className="glass-card rounded-3xl p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-red-400/5 rounded-full blur-2xl group-hover:bg-red-400/10 transition-all"></div>
                                    <Shield className="text-red-400 mb-6" size={32} />
                                    <div className={`text-5xl font-black italic ${text} mb-2`}>{isLoading ? '...' : dashboardData.total_unpaid_users.toLocaleString()}</div>
                                    <div className={`text-sm font-black ${textMuted} uppercase tracking-widest`}>Unpaid Users</div>
                                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-red-400 bg-red-400/10 w-fit px-3 py-1 rounded-full">
                                        <Activity size={12} />
                                        <span>Action Required</span>
                                    </div>
                                </div>

                                {/* Total Groups */}
                                <div className="glass-card rounded-3xl p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-lime-400/5 rounded-full blur-2xl group-hover:bg-lime-400/10 transition-all"></div>
                                    <Layers className="text-lime-400 mb-6" size={32} />
                                    <div className={`text-5xl font-black italic ${text} mb-2`}>{isLoading ? '...' : dashboardData.total_groups.toLocaleString()}</div>
                                    <div className={`text-sm font-black ${textMuted} uppercase tracking-widest`}>Total Groups</div>
                                    <div className={`mt-4 flex items-center gap-2 text-xs font-bold ${textMuted} bg-white/5 w-fit px-3 py-1 rounded-full`}>
                                        <Activity size={12} />
                                        <span>Stable</span>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
                                <h2 className={`text-xl font-black italic uppercase tracking-tight mb-8 ${text}`}>System Activity</h2>
                                <ActivityPulse />
                            </div>
                        </div>
                    ) : view === 'groups' ? (
                        <div className="w-full animate-slide-up">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                <div>
                                    <h2 className={`text-2xl font-black italic uppercase tracking-tight ${text}`}>Active Communities</h2>
                                    <p className={`${textMuted} text-sm mt-1`}>Found {groups.length} active groups in the ecosystem.</p>
                                </div>
                                <button className="flex items-center gap-2 bg-lime-400 text-black px-5 py-2.5 rounded-xl font-bold transition-all shadow-xl hover:shadow-lime-400/20 active:scale-95">
                                    <Layers size={18} />
                                    <span className="text-sm uppercase tracking-wider">Create New Group</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredGroups.map((group, idx) => (
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

                                            <h3 className={`text-xl font-black italic tracking-tight ${text} mb-2 group-hover:text-lime-400 transition-colors uppercase truncate`}>{group.name}</h3>
                                            <p className={`${textMuted} text-xs font-medium line-clamp-2 leading-relaxed mb-6 h-8 italic`}>"{group.description || 'No description provided.'}"</p>

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

                            {filteredGroups.length === 0 && (
                                <div className="p-20 text-center glass rounded-[2rem] border border-dashed border-white/10 mt-10">
                                    <Layers size={48} className="mx-auto text-gray-700 mb-4 opacity-20" />
                                    <p className="text-gray-500 font-bold italic tracking-tighter">No groups detected in the system.</p>
                                </div>
                            )}
                        </div>
                    ) : view === 'users' ? (
                        <div className="w-full animate-slide-up">
                            {/* Users View Filters */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                <div className={`flex gap-2 p-1.5 rounded-2xl w-fit glass ${isDark ? 'bg-gray-900/50' : 'bg-white/80'}`}>
                                    {['All', 'Paid', 'Unpaid'].map(flavor => (
                                        <button
                                            key={flavor}
                                            onClick={() => setUserFilter(flavor)}
                                            className={`px-6 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${userFilter === flavor
                                                ? 'bg-lime-400 text-black shadow-[0_0_15px_rgba(163,230,53,0.3)]'
                                                : isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-black/5'
                                                }`}
                                        >
                                            {flavor}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Users Table */}
                            <div className="glass-card rounded-[2rem] overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className={`border-b ${borderColor} ${theadBg}`}>
                                                <th className={`p-6 text-[10px] font-black uppercase ${textMuted} tracking-widest`}>User Details</th>
                                                <th className={`p-6 text-[10px] font-black uppercase ${textMuted} tracking-widest`}>Access</th>
                                                <th className={`p-6 text-[10px] font-black uppercase ${textMuted} tracking-widest`}>Status</th>
                                                <th className={`p-6 text-[10px] font-black uppercase ${textMuted} tracking-widest`}>Type</th>
                                                <th className="p-6"></th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y ${divideColor}`}>
                                            {filteredUsers.map((user, idx) => (
                                                <tr
                                                    key={user.id}
                                                    onClick={() => setSelectedUser(user)}
                                                    className={`group ${rowHover} transition-colors cursor-pointer animate-fade-in`}
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
                                                                <div className={`font-bold flex items-center gap-2 ${text} group-hover:text-lime-400 transition-colors`}>
                                                                    {user.username || user.name || 'Anonymous'}
                                                                </div>
                                                                <div className={`text-xs ${textMuted} flex items-center gap-1 mt-1`}>
                                                                    <Mail size={10} />
                                                                    {user.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <div className={`text-[15px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg w-fit ${user.role === 'admin' ? 'bg-lime-400/10 text-lime-400 border border-lime-400/20' : 'bg-white/5 text-green-400 border border-white/5'}`}>
                                                            {user.role}
                                                        </div>
                                                    </td>
                                                    <td className="p-6" onClick={e => e.stopPropagation()}>
                                                        {(() => {
                                                            const isActive = user.account_is_active === 1 || user.account_is_active === true || user.is_active;
                                                            return (
                                                                <div className="relative flex items-center bg-gray-900/80 rounded-xl border border-white/6 p-0.5 w-fit shadow-inner">
                                                                    {/* Sliding highlight */}
                                                                    <div
                                                                        className={`absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-[10px] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isActive
                                                                            ? 'left-0.5 bg-lime-400 shadow-[0_0_12px_rgba(163,230,53,0.5)]'
                                                                            : 'left-[calc(50%+1px)] bg-red-900'
                                                                            }`}
                                                                    />
                                                                    {/* Active button */}
                                                                    {/* Active button */}
                                                                    <button
                                                                        onClick={() => handleStatusChange(user, 1)}
                                                                        className={`relative z-10 px-3 py-1 rounded-[10px] text-[10px] font-white uppercase tracking-widest transition-colors duration-200 ${isActive ? 'text-white' : `${textMuted} hover:text-white`}`}
                                                                    >
                                                                        Active
                                                                    </button>
                                                                    {/* Inactive button */}
                                                                    <button
                                                                        onClick={() => handleStatusChange(user, 0)}
                                                                        className={`relative z-10 px-3 py-1 rounded-[10px] text-[10px] font-green uppercase tracking-widest transition-colors duration-200 ${!isActive ? (isDark ? 'text-white' : 'text-white') : `${textMuted} hover:text-white`}`}
                                                                    >
                                                                        Inactive
                                                                    </button>
                                                                </div>
                                                            );
                                                        })()}
                                                    </td>
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-2">
                                                            {user.payment_status ? (
                                                                <div className="flex items-center gap-1.5 text-lime-400 bg-lime-400/10 px-2.5 py-1 rounded-md text-xs font-bold border border-lime-400/20 shadow-[0_0_10px_rgba(163,230,53,0.05)]">
                                                                    <CheckCircle2 size={12} />
                                                                    Paid
                                                                </div>
                                                            ) : (
                                                                <div className={`flex items-center gap-1.5 ${textSub} bg-gray-900 px-2.5 py-1 rounded-md text-xs font-bold border ${borderColor}`}>
                                                                    Unpaid
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-6 text-right">
                                                        <button className={`p-2 ${textMuted} hover:text-lime-400 transition-colors rounded-xl hover:bg-lime-400/10 hover:scale-110`}>
                                                            <ArrowUpRight size={20} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {filteredUsers.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className={`p-10 text-center ${textMuted} font-bold`}>
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
                        <div className="w-full animate-slide-up">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className={`text-2xl font-black italic uppercase tracking-tight ${text}`}>Community Content</h2>
                                    <p className={`${textMuted} text-sm mt-1`}>{posts.length} posts actively monitored.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`flex items-center px-3 py-2 rounded-xl border ${isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                                        <input
                                            type="date"
                                            value={postDateFilter}
                                            onChange={(e) => setPostDateFilter(e.target.value)}
                                            className={`bg-transparent outline-none text-sm ${text} [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
                                            title="Filter by Date"
                                        />
                                        {postDateFilter && (
                                            <button
                                                onClick={() => setPostDateFilter('')}
                                                className={`ml-2 p-1 rounded-full hover:bg-black/10 ${textMuted} hover:text-red-400`}
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>
                                    <button className={`flex items-center gap-2 ${isDark ? 'bg-white/5 hover:bg-white/10 text-white border-white/10 hover:border-white/20' : 'bg-black/5 hover:bg-black/10 text-gray-900 border-gray-200 hover:border-gray-300'} px-5 py-2.5 rounded-xl font-bold transition-all border shadow-xl`} onClick={() => {
                                        /* Force refresh */
                                        setIsLoadingPosts(true);
                                        getAllPosts().then(res => {
                                            console.log('[Posts Refresh] API Response:', res);
                                            const rawPosts = Array.isArray(res?.posts) ? res.posts
                                                : Array.isArray(res?.data) ? res.data
                                                    : Array.isArray(res) ? res
                                                        : [];
                                            setPosts(rawPosts);
                                            setIsLoadingPosts(false);
                                        });
                                    }}>
                                        <Clock size={18} />
                                        <span className="text-sm">Refresh Feed</span>
                                    </button>
                                </div>
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
                                                        <div className={`text-sm font-bold ${text} truncate group-hover:text-lime-400 transition-colors`}>
                                                            {post.user?.username || 'Unknown User'}
                                                        </div>
                                                        <div className={`text-[10px] ${textMuted} truncate`}>
                                                            {new Date(post.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Text Content */}
                                                <p className={`${textSub} text-sm mb-4 line-clamp-3 overflow-hidden flex-1 group-hover:${text} transition-colors`}>
                                                    {post.content || <span className={`${textMuted} italic`}>No text content</span>}
                                                </p>

                                                {/* Stats Footer */}
                                                <div className={`pt-4 mt-auto border-t ${borderColor} flex items-center justify-between text-xs ${textSub} font-bold uppercase tracking-wider`}>
                                                    <div className={`flex items-center gap-1.5 ${isDark ? 'bg-white/5' : 'bg-black/5'} px-2 py-1 rounded-md`}>
                                                        <span className="text-lime-400">♥</span> {post.like_count}
                                                    </div>
                                                    <div className={`flex items-center gap-1.5 ${isDark ? 'bg-white/5' : 'bg-black/5'} px-2 py-1 rounded-md`}>
                                                        <span className="text-blue-400">💬</span> {post.comment_count}
                                                    </div>
                                                    <div className={`flex items-center gap-1.5 ${isDark ? 'bg-white/5' : 'bg-black/5'} px-2 py-1 rounded-md`}>
                                                        <span className="text-purple-400">↗</span> {post.share_count}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!isLoadingPosts && filteredPosts.length === 0 && (
                                <div className={`p-20 text-center glass rounded-[2rem] border border-dashed ${borderColor} mt-10`}>
                                    <ImageIcon size={48} className={`mx-auto ${textSub} mb-4 opacity-20`} />
                                    <p className={`${textMuted} font-bold italic tracking-tighter`}>No posts found.</p>
                                </div>
                            )}
                        </div>
                    ) : view === 'menu' ? (
                        <div className="w-full animate-slide-up">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                <div>
                                    <h2 className={`text-2xl font-black italic uppercase tracking-tight ${text}`}>Unpaid Access Control</h2>
                                    <p className={`${textMuted} text-sm mt-1`}>{menuItems.length} menu mappings configured.</p>
                                </div>
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="bg-lime-400 hover:bg-lime-300 text-black px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2"
                                >
                                    <span className="text-lg leading-none">+</span> Add Access
                                </button>
                            </div>

                            {/* Table */}
                            <div className="glass-card rounded-[2rem] overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className={`border-b ${borderColor} ${theadBg}`}>
                                                <th className={`p-6 text-[10px] font-black uppercase ${textMuted} tracking-widest`}>ID</th>
                                                <th className={`p-6 text-[10px] font-black uppercase ${textMuted} tracking-widest`}>Menu</th>
                                                <th className={`p-6 text-[10px] font-black uppercase ${textMuted} tracking-widest`}>Submenu</th>
                                                <th className={`p-6 text-[10px] font-black uppercase ${textMuted} tracking-widest text-right`}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y ${divideColor}`}>
                                            {isLoadingMenu ? (
                                                <tr>
                                                    <td colSpan={4} className="p-10 text-center">
                                                        <div className="w-8 h-8 mx-auto border-2 border-lime-400/20 border-t-lime-400 rounded-full animate-spin mb-3"></div>
                                                        <p className="text-gray-500 font-bold italic tracking-tighter text-sm">Loading access mappings...</p>
                                                    </td>
                                                </tr>
                                            ) : menuItems.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} className="p-10 text-center">
                                                        <LayoutList size={32} className="mx-auto text-gray-700 mb-4 opacity-20" />
                                                        <p className="text-gray-500 font-bold italic tracking-tighter text-sm">No mappings found.</p>
                                                    </td>
                                                </tr>
                                            ) : (
                                                menuItems.map((item, idx) => (
                                                    <tr
                                                        key={item.id}
                                                        className={`group ${rowHover} transition-colors animate-fade-in`}
                                                        style={{ animationDelay: `${idx * 0.05}s` }}
                                                    >
                                                        <td className="p-6">
                                                            <div className="text-sm font-bold text-gray-400">#{item.id}</div>
                                                        </td>
                                                        <td className="p-6">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl group-hover:scale-110 group-hover:border-lime-400/30 transition-all duration-300 overflow-hidden">
                                                                    {item.menu_image ? (
                                                                        <img src={resolveImageUrl(item.menu_image) || ''} alt="" className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <Layers size={18} className="text-gray-500" />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <div className={`font-bold ${text} group-hover:text-lime-400 transition-colors`}>{item.menu_name || 'Unknown'}</div>
                                                                    <div className={`text-[10px] ${textMuted} uppercase tracking-widest mt-0.5`}>Menu ID: {item.menu_id}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-6">
                                                            {item.submenu_id ? (
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-lg bg-black/30 border border-white/5 flex items-center justify-center text-sm shadow-inner overflow-hidden">
                                                                        {item.submenu_image ? (
                                                                            <img src={resolveImageUrl(item.submenu_image) || ''} alt="" className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <span className="text-gray-600">-</span>
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <div className={`font-bold ${text}`}>{item.submenu_name || 'Unknown'}</div>
                                                                        <div className={`text-[10px] ${textMuted} uppercase tracking-widest mt-0.5`}>Sub ID: {item.submenu_id}</div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="text-sm font-bold text-gray-600 italic px-3 py-1.5 rounded-lg bg-white/5 w-fit border border-white/5">No Submenu</div>
                                                            )}
                                                        </td>
                                                        <td className="p-6 text-right">
                                                            <button
                                                                onClick={() => setAccessToRemove(item)}
                                                                className="p-2 text-gray-600 hover:text-red-400 transition-colors rounded-xl hover:bg-red-500/10 hover:scale-110 inline-flex"
                                                                title="Remove Access"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Add Access Modal */}
                            {isAddModalOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in" onClick={() => setIsAddModalOpen(false)}></div>
                                    <div className="relative w-full max-w-sm glass-card rounded-3xl p-8 animate-scale-in border border-white/10 shadow-2xl overflow-hidden group/modal">
                                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-lime-400/10 rounded-full blur-3xl group-hover/modal:bg-lime-400/20 transition-colors"></div>
                                        <button
                                            onClick={() => setIsAddModalOpen(false)}
                                            style={{ transform: 'none' }}
                                            className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer text-xs font-bold border border-white/10"
                                        >
                                            <X size={14} />
                                            <span>Close</span>
                                        </button>

                                        <h3 className={`text-xl font-black italic uppercase tracking-tight ${text} mb-6 relative z-10 flex items-center gap-3`}>
                                            <Layers size={20} className="text-lime-400" />
                                            Add Access
                                        </h3>

                                        <div className="space-y-4 relative z-10">
                                            <div>
                                                <label className={`text-xs font-bold ${textSub} uppercase tracking-widest mb-1.5 block`}>Menu ID *</label>
                                                <input
                                                    type="number"
                                                    placeholder="e.g. 1"
                                                    value={newMenuId}
                                                    onChange={e => { setNewMenuId(e.target.value); setAddMenuError(null); }}
                                                    className={`w-full ${inputBg} border ${inputBorder} rounded-xl px-4 py-3 text-sm ${text} placeholder:text-gray-500 outline-none focus:border-lime-400/40 focus:bg-white/[0.04] transition-all`}
                                                />
                                            </div>
                                            <div>
                                                <label className={`text-xs font-bold ${textSub} uppercase tracking-widest mb-1.5 block`}>Submenu ID (Optional)</label>
                                                <input
                                                    type="number"
                                                    placeholder="e.g. 2"
                                                    value={newSubmenuId}
                                                    onChange={e => { setNewSubmenuId(e.target.value); setAddMenuError(null); }}
                                                    className={`w-full ${inputBg} border ${inputBorder} rounded-xl px-4 py-3 text-sm ${text} placeholder:text-gray-500 outline-none focus:border-lime-400/40 focus:bg-white/[0.04] transition-all`}
                                                />
                                            </div>

                                            {addMenuError && (
                                                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-fade-in shadow-inner">
                                                    <div className="mt-0.5 rounded-full bg-red-500/20 text-red-500 p-1 shrink-0">
                                                        <Shield size={12} />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold text-red-400 mb-0.5 uppercase tracking-wider">Access Denied</div>
                                                        <p className="text-xs text-red-400/80 italic">{addMenuError}</p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="pt-4">
                                                <button
                                                    disabled={isAddingMenu || !newMenuId.trim()}
                                                    onClick={handleAddAccessMenuItem}
                                                    className="w-full bg-lime-400 hover:bg-lime-300 disabled:opacity-50 text-black px-4 py-3.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(163,230,53,0.2)] active:scale-95 flex items-center justify-center gap-2 border border-lime-400/50"
                                                >
                                                    {isAddingMenu ? (
                                                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                                                    ) : 'Grant Access'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Delete Confirmation Modal */}
                            {accessToRemove !== null && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in" onClick={() => !isRemovingAccess && setAccessToRemove(null)}></div>
                                    <div className="relative w-full max-w-sm glass-card rounded-3xl p-8 animate-scale-in border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)] overflow-hidden group/modal text-center">
                                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-500/10 rounded-full blur-3xl transition-colors"></div>
                                        <button
                                            onClick={() => !isRemovingAccess && setAccessToRemove(null)}
                                            disabled={isRemovingAccess}
                                            style={{ transform: 'none' }}
                                            className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer text-xs font-bold border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <X size={14} />
                                            <span>Close</span>
                                        </button>

                                        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-6 relative z-10 border border-red-500/20 shadow-inner">
                                            <Trash2 size={24} className={isRemovingAccess ? "animate-bounce" : ""} />
                                        </div>

                                        <h3 className={`text-xl font-black italic uppercase tracking-tight ${text} mb-2 relative z-10`}>Remove Access?</h3>
                                        <p className={`text-sm ${textMuted} mb-8 relative z-10`}>This action cannot be undone. Are you sure you want to permanently delete this menu mapping?</p>

                                        <div className="flex gap-3 relative z-10">
                                            <button
                                                onClick={() => setAccessToRemove(null)}
                                                disabled={isRemovingAccess}
                                                className={`flex-1 bg-white/5 hover:bg-white/10 ${text} px-4 py-3 rounded-xl font-bold transition-all disabled:opacity-50`}
                                            >
                                                No, Keep It
                                            </button>
                                            <button
                                                onClick={() => handleRemoveAccessMenuItem(accessToRemove)}
                                                disabled={isRemovingAccess}
                                                className="flex-1 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white px-4 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)] active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                {isRemovingAccess ? (
                                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                                ) : 'Yes, Delete'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : view === 'workout_setting' ? (
                        <div className="w-full animate-slide-up">
                            {/* Workout Folder Navigation */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                                <div>
                                    <h2 className={`text-2xl font-black italic uppercase tracking-tight ${text}`}>Workout Dynamics</h2>
                                    <p className={`${textMuted} text-sm mt-1`}>Manage and organize your instructional content library.</p>
                                </div>
                                <div className={`flex gap-3 p-2 rounded-2xl w-fit glass ${isDark ? 'bg-gray-900/50' : 'bg-white/80'} border ${borderColor}`}>
                                    {[
                                        { id: 'library', label: 'All Content', icon: <Folder size={18} className="text-lime-400" /> },
                                        // { id: 'published', label: 'Published', icon: <FolderCheck size={18} className="text-blue-400" /> },
                                        // { id: 'drafts', label: 'Drafts', icon: <Folder size={18} className="text-amber-400" /> },
                                        { id: 'upload', label: 'New Asset', icon: <FolderPlus size={18} className="text-purple-400" /> }
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setWorkoutSubView(tab.id)}
                                            className={`px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-3 ${workoutSubView === tab.id
                                                ? 'bg-lime-400 text-black shadow-[0_10px_30px_rgba(163,230,53,0.3)] scale-105 border border-lime-400'
                                                : isDark ? 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent' : 'text-gray-500 hover:text-gray-900 hover:bg-black/5 border border-transparent'
                                                }`}
                                        >
                                            {workoutSubView === tab.id ? React.cloneElement(tab.icon as React.ReactElement<any>, { className: 'text-black' }) : tab.icon}
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {workoutSubView === 'upload' ? (
                                <div className="animate-fade-in">
                                    <div className="glass-card rounded-[2.5rem] p-8 md:p-10 border border-lime-400/20 relative overflow-hidden group/form">
                                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-lime-400/10 rounded-full blur-[100px] group-hover/form:bg-lime-400/20 transition-all duration-700"></div>

                                        <h3 className={`text-2xl font-black italic uppercase tracking-tight ${text} mb-8 relative z-10 flex items-center gap-4`}>
                                            <div className="w-10 h-10 bg-lime-400/20 rounded-xl flex items-center justify-center text-lime-400 border border-lime-400/20">
                                                <Activity size={20} />
                                            </div>
                                            Publish New Content
                                        </h3>

                                        <div className="space-y-6 relative z-10">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-6">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className={`text-[10px] font-black ${textSub} uppercase tracking-[0.2em] mb-2 block ml-1`}>Video Title</label>
                                                            <input
                                                                type="text"
                                                                placeholder="Display title..."
                                                                value={newVideoTitle}
                                                                onChange={e => setNewVideoTitle(e.target.value)}
                                                                className={`w-full ${inputBg} border ${inputBorder} rounded-2xl px-4 py-3.5 text-sm ${text} placeholder:text-gray-600 outline-none focus:border-lime-400/40 focus:ring-4 focus:ring-lime-400/5 transition-all`}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className={`text-[10px] font-black ${textSub} uppercase tracking-[0.2em] mb-2 block ml-1`}>Video Name</label>
                                                            <input
                                                                type="text"
                                                                placeholder="e.g. Legs_Day_01"
                                                                value={newVideoName}
                                                                onChange={e => setNewVideoName(e.target.value)}
                                                                className={`w-full ${inputBg} border ${inputBorder} rounded-2xl px-4 py-3.5 text-sm ${text} placeholder:text-gray-600 outline-none focus:border-lime-400/40 focus:ring-4 focus:ring-lime-400/5 transition-all`}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className={`text-[10px] font-black ${textSub} uppercase tracking-[0.2em] mb-2 block ml-1`}>Description</label>
                                                        <textarea
                                                            placeholder="Describe the workout..."
                                                            rows={3}
                                                            value={newVideoDescription}
                                                            onChange={e => setNewVideoDescription(e.target.value)}
                                                            className={`w-full ${inputBg} border ${inputBorder} rounded-2xl px-5 py-4 text-sm ${text} placeholder:text-gray-600 outline-none focus:border-lime-400/40 focus:ring-4 focus:ring-lime-400/5 transition-all resize-none`}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <div>
                                                        <label className={`text-[10px] font-black ${textSub} uppercase tracking-[0.2em] mb-2 block ml-1`}>Duration</label>
                                                        <input
                                                            type="text"
                                                            placeholder="e.g. 10:30"
                                                            value={newVideoDuration}
                                                            onChange={e => setNewVideoDuration(e.target.value)}
                                                            className={`w-full ${inputBg} border ${inputBorder} rounded-2xl px-5 py-4 text-sm ${text} placeholder:text-gray-600 outline-none focus:border-lime-400/40 focus:ring-4 focus:ring-lime-400/5 transition-all`}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className={`text-[10px] font-black ${textSub} uppercase tracking-[0.2em] mb-2 block ml-1`}>Video File</label>
                                                            <div className={`relative group/file`}>
                                                                <input
                                                                    type="file"
                                                                    accept="video/*"
                                                                    onChange={e => setNewVideoFile(e.target.files?.[0] || null)}
                                                                    className="hidden"
                                                                    id="video-upload"
                                                                />
                                                                <label
                                                                    htmlFor="video-upload"
                                                                    className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 border-dashed ${newVideoFile ? 'border-lime-400/40 bg-lime-400/5' : 'border-white/10 hover:border-lime-400/30'} cursor-pointer transition-all h-[100px] group-hover/file:bg-white/[0.02]`}
                                                                >
                                                                    <div className={`${newVideoFile ? 'text-lime-400' : 'text-gray-600'}`}>
                                                                        <Activity size={20} />
                                                                    </div>
                                                                    <span className={`text-[9px] font-bold ${newVideoFile ? 'text-lime-400' : 'text-gray-500'} uppercase tracking-widest text-center truncate w-full px-2`}>
                                                                        {newVideoFile ? newVideoFile.name : 'Video'}
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className={`text-[10px] font-black ${textSub} uppercase tracking-[0.2em] mb-2 block ml-1`}>Thumbnail</label>
                                                            <div className={`relative group/file`}>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={e => setNewThumbnailFile(e.target.files?.[0] || null)}
                                                                    className="hidden"
                                                                    id="thumb-upload"
                                                                />
                                                                <label
                                                                    htmlFor="thumb-upload"
                                                                    className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 border-dashed ${newThumbnailFile ? 'border-lime-400/40 bg-lime-400/5' : 'border-white/10 hover:border-lime-400/30'} cursor-pointer transition-all h-[100px] group-hover/file:bg-white/[0.02]`}
                                                                >
                                                                    <div className={`${newThumbnailFile ? 'text-lime-400' : 'text-gray-600'}`}>
                                                                        <ImageIcon size={20} />
                                                                    </div>
                                                                    <span className={`text-[9px] font-bold ${newThumbnailFile ? 'text-lime-400' : 'text-gray-500'} uppercase tracking-widest text-center truncate w-full px-2`}>
                                                                        {newThumbnailFile ? newThumbnailFile.name : 'Image'}
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {uploadError && (
                                                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 animate-fade-in">
                                                            <Shield size={14} className="text-red-500" />
                                                            <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider">{uploadError}</p>
                                                        </div>
                                                    )}

                                                    <button
                                                        disabled={isUploadingVideo}
                                                        onClick={handleUploadVideo}
                                                        className={`w-full mt-4 ${!newVideoTitle || !newVideoDescription || !newVideoFile || !newThumbnailFile ? 'bg-gray-800 text-gray-500' : 'bg-lime-400 text-white shadow-[0_10px_30px_rgba(163,230,53,0.2)]'} py-4 rounded-2xl font-black italic uppercase tracking-[0.2em] transition-all active:scale-[0.98] flex items-center justify-center gap-3 group/btn animate-scale-in`}
                                                    >
                                                        {isUploadingVideo ? (
                                                            <>
                                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                                <span>Uploading...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span>{(!newVideoTitle || !newVideoDescription || !newVideoFile || !newThumbnailFile) ? 'Complete Fields' : 'Upload Content'}</span>
                                                                <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : workoutSubView === 'library' || workoutSubView === 'published' || workoutSubView === 'drafts' ? (
                                <div className="animate-fade-in">
                                    <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-lime-400/[0.02] to-transparent pointer-events-none"></div>
                                        <div className="overflow-x-auto relative z-10">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className={`border-b ${borderColor} ${theadBg}`}>
                                                        <th className={`p-8 text-[10px] font-black uppercase ${textMuted} tracking-[0.3em]`}>Thumbnail</th>
                                                        {/* <th className={`p-8 text-[10px] font-black uppercase ${textMuted} tracking-[0.3em]`}>Name</th> */}

                                                        <th className={`p-8 text-[10px] font-black uppercase ${textMuted} tracking-[0.3em]`}>Status</th>
                                                        <th className={`p-8 text-[10px] font-black uppercase ${textMuted} tracking-[0.3em]`}>Runtime</th>
                                                        <th className={`p-8 text-[10px] font-black uppercase ${textMuted} tracking-[0.3em]`}>Top</th>

                                                        <th className="p-8">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className={`divide-y ${divideColor}`}>
                                                    {isLoadingWorkouts ? (
                                                        <tr>
                                                            <td colSpan={5} className="p-32 text-center">
                                                                <div className="w-16 h-16 mx-auto border-4 border-lime-400/20 border-t-lime-400 rounded-full animate-spin mb-6"></div>
                                                                <p className="text-gray-500 font-black italic uppercase tracking-[0.4em] text-[10px]">Synchronizing Digital Library...</p>
                                                            </td>
                                                        </tr>
                                                    ) : workouts.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={5} className="p-32 text-center">
                                                                <div className="relative w-24 h-24 mx-auto mb-8">
                                                                    <div className="absolute inset-0 bg-lime-400/10 blur-2xl rounded-full animate-pulse"></div>
                                                                    <Folder size={64} className="relative mx-auto text-gray-800 opacity-30" />
                                                                </div>
                                                                <p className="text-gray-500 font-black italic tracking-widest uppercase text-xs">Directory Empty</p>
                                                                <p className={`${textSub} text-[10px] mt-2 italic uppercase tracking-widest`}>No content matching the current filter.</p>
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        [...workouts]
                                                            .filter(v => {
                                                                if (workoutSubView === 'published') return true;
                                                                if (workoutSubView === 'drafts') return false;
                                                                return true;
                                                            })
                                                            .reverse()
                                                            .map((video, idx) => (
                                                                <tr
                                                                    key={video.uuid || video.video_id || idx}
                                                                    className={`group ${rowHover} transition-all duration-500 animate-fade-in cursor-default`}
                                                                    style={{ animationDelay: `${idx * 0.04}s` }}
                                                                >
                                                                    <td className="p-8">
                                                                        <div className="w-24 h-16 rounded-2xl bg-black border border-white/10 relative overflow-hidden shrink-0 group-hover:border-lime-400/50 transition-all duration-500 shadow-2xl group-hover:shadow-lime-400/20">
                                                                            {video.thumbnail_url || video.thumbnail ? (
                                                                                <img src={resolveImageUrl(video.thumbnail_url || video.thumbnail) || ''} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                                            ) : (
                                                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-lime-400/20">
                                                                                    <Activity size={24} />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </td>

                                                                    {/* <td className="p-8">
                                                                        <div className={`text-sm font-bold ${textSub} line-clamp-1`}>
                                                                            {video.title}
                                                                        </div>
                                                                    </td> */}
                                                                    <td className="p-8">
                                                                        <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border w-fit ${video.status === 'published' ? 'bg-lime-400/10 border-lime-400/30 text-lime-400' :
                                                                            video.status === 'archived' ? 'bg-orange-400/10 border-orange-400/30 text-orange-400' :
                                                                                'bg-white/5 border-white/10 text-gray-400'
                                                                            }`}>
                                                                            {video.status || 'Draft'}
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-8">
                                                                        <div className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest group-hover:text-white transition-colors">
                                                                            <Clock size={12} className="text-lime-400" />
                                                                            {video.duration || '00:00'}
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-8">
                                                                        {video.is_top === 1 ? (
                                                                            <div className="flex items-center gap-1.5 text-lime-400">
                                                                                <TrendingUp size={14} />
                                                                                <span className="text-[10px] font-black uppercase tracking-tighter italic">Featured</span>
                                                                            </div>
                                                                        ) : (
                                                                            <span className="text-[10px] font-bold text-gray-600 uppercase italic">Standard</span>
                                                                        )}
                                                                    </td>
                                                                    <td className="p-8 text-right">
                                                                        <div className="flex items-center justify-middle gap-3">
                                                                            <button
                                                                                onClick={() => setSelectedVideo(video)}
                                                                                className={`p-3 bg-lime-400/10 text-lime-400 hover:bg-lime-400 hover:text-black transition-all rounded-2xl hover:scale-110 border border-lime-400/20 shadow-lg`}
                                                                                title="View Intelligent Specs"
                                                                            >
                                                                                <Eye size={20} />
                                                                            </button>

                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-32 text-center glass rounded-[3rem] border border-dashed border-white/10 animate-fade-in relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-lime-400/[0.05] to-transparent"></div>
                                    <TrendingUp size={80} className="mx-auto text-lime-400/20 mb-8 group-hover:scale-110 transition-transform duration-700" />
                                    <h3 className={`text-3xl font-black italic uppercase tracking-tighter ${text} mb-4`}>Performance Intelligence</h3>
                                    <p className={`${textMuted} text-xs font-bold uppercase tracking-[0.3em] max-w-md mx-auto leading-relaxed`}>Real-time analytics and user engagement metrics for the video ecosystem are currently synchronizing.</p>
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
                                style={{ transform: 'none' }}
                                className="absolute top-6 right-6 z-20 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer text-sm font-bold border border-white/10 shadow-lg"
                            >
                                <X size={16} />
                                <span>Close</span>
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
                                        <div className={`flex items-center gap-2 bg-white/5 border ${borderColor} px-3 py-1.5 rounded-lg text-xs font-bold ${textSub} shadow-md`}>
                                            <Shield size={14} className="text-lime-400" />
                                            {selectedUser.role}
                                        </div>
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md ${selectedUser.payment_status ? 'bg-lime-400/10 border border-lime-400/30 text-lime-400' : `bg-white/5 border ${borderColor} ${textSub}`}`}>
                                            <CreditCard size={14} />
                                            {selectedUser.payment_status ? 'Paid Member' : 'Unpaid User'}
                                        </div>
                                        <div className={`flex items-center gap-2 bg-white/5 border ${borderColor} px-3 py-1.5 rounded-lg text-xs font-bold ${textSub} shadow-md`}>
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
                                style={{ transform: 'none' }}
                                className="absolute top-6 right-6 z-20 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer text-sm font-bold border border-white/10 shadow-lg"
                            >
                                <X size={16} />
                                <span>Close</span>
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
                                        <h2 className={`text-4xl font-black italic tracking-tight uppercase ${text} mb-2`}>{selectedGroup.name}</h2>
                                        <p className={`${textMuted} text-sm font-medium italic`}>"{selectedGroup.description || 'No description provided.'}"</p>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6">
                                        <div className={`flex items-center gap-2 bg-white/5 border ${borderColor} px-3 py-1.5 rounded-lg text-xs font-bold ${textSub} shadow-md`}>
                                            <Users size={14} className="text-lime-400" />
                                            {selectedGroup.total_members} Members
                                        </div>
                                        <div className={`flex items-center gap-2 bg-white/5 border ${borderColor} px-3 py-1.5 rounded-lg text-xs font-bold ${textSub} shadow-md`}>
                                            <Calendar size={14} className="text-blue-400" />
                                            Created {new Date(selectedGroup.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                <h3 className={`text-sm font-black ${textSub} uppercase tracking-[0.2em] flex items-center gap-3 mb-6`}>
                                    <span>Group Members</span>
                                    <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                                </h3>

                                {isLoadingGroupMembers ? (
                                    <div className="flex flex-col items-center justify-center p-20 gap-4">
                                        <div className="w-12 h-12 border-4 border-lime-400/20 border-t-lime-400 rounded-full animate-spin"></div>
                                        <p className={`${textMuted} font-bold italic tracking-tighter`}>Retrieving members list...</p>
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
                                                        <div className={`font-bold flex items-center gap-2 ${text} group-hover:text-lime-400 transition-colors truncate`}>
                                                            {u.username || u.name || 'Anonymous'}
                                                        </div>
                                                        <div className={`text-xs ${textMuted} flex items-center gap-1 mt-1 truncate`}>
                                                            <Mail size={10} />
                                                            {u.email}
                                                        </div>
                                                        <div className={`mt-2 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md w-fit bg-white/5 ${textSub} border border-white/5`}>
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

                {/* Video Detail Modal */}
                {selectedVideo && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 md:p-8">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-fade-in" onClick={() => { setSelectedVideo(null); setSelectedVideoDetails(null); }}></div>

                        <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden glass-card rounded-[3rem] animate-scale-in border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col">
                            {/* Close btn */}
                            <button
                                onClick={() => { setSelectedVideo(null); setSelectedVideoDetails(null); }}
                                style={{ transform: 'none' }}
                                className="absolute top-8 right-8 z-20 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer text-sm font-bold border border-white/10 shadow-xl"
                            >
                                <X size={16} />
                                <span>Close</span>
                            </button>

                            <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
                                {isLoadingVideoDetails ? (
                                    <div className="flex flex-col items-center justify-center h-[500px]">
                                        <div className="w-20 h-20 border-4 border-lime-400/20 border-t-lime-400 rounded-full animate-spin mb-8 shadow-[0_0_30px_rgba(163,230,53,0.2)]"></div>
                                        <p className="text-gray-500 font-black italic uppercase tracking-[0.4em] text-xs">Decrypting Asset Metadata...</p>
                                    </div>
                                ) : selectedVideoDetails ? (
                                    <div className="space-y-12 animate-fade-in">
                                        {/* Header / Banner */}
                                        <div className="relative rounded-[2.5rem] overflow-hidden group/banner aspect-[21/9] border border-white/10 shadow-2xl">
                                            {selectedVideoDetails.thumbnail_url || selectedVideoDetails.thumbnail ? (
                                                <img
                                                    src={resolveImageUrl(selectedVideoDetails.thumbnail_url || selectedVideoDetails.thumbnail) || ''}
                                                    alt={selectedVideoDetails.title}
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover/banner:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-lime-400/10">
                                                    <Activity size={120} />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

                                            <div className="absolute bottom-8 left-8 right-8">
                                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${selectedVideoDetails.status === 'published' ? 'bg-lime-400 text-black border-lime-400' : 'bg-orange-500/20 text-orange-400 border-orange-500/30'}`}>
                                                        {selectedVideoDetails.status}
                                                    </div>
                                                    {selectedVideoDetails.is_top === 1 && (
                                                        <div className="px-4 py-1.5 rounded-full bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] border border-blue-400 flex items-center gap-2">
                                                            <TrendingUp size={12} />
                                                            <span>Top Pick</span>
                                                        </div>
                                                    )}
                                                    <div className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 flex items-center gap-2 ml-auto">
                                                        <Clock size={12} />
                                                        <span>{selectedVideoDetails.duration}</span>
                                                    </div>
                                                </div>
                                                <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase drop-shadow-2xl line-clamp-2">
                                                    {selectedVideoDetails.title}
                                                </h2>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                            {/* Left Column: Details */}
                                            <div className="lg:col-span-2 space-y-10">
                                                <div className="space-y-4">
                                                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-3">
                                                        <span>Intellectual Manifest</span>
                                                        <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                                                    </h3>
                                                    <p className={`text-lg leading-relaxed ${textMuted} font-medium italic`}>
                                                        "{selectedVideoDetails.description || 'No description provided for this asset.'}"
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Right Column: Meta */}
                                            {/* <div className="space-y-8">
                                                <div className="p-6 rounded-[2rem] bg-gradient-to-br from-lime-400/10 to-transparent border border-lime-400/20">
                                                    <div className="flex items-center gap-3 text-lime-400 mb-2">
                                                        <Activity size={16} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest italic">System Insight</span>
                                                    </div>
                                                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed italic">
                                                        This content was synchronized with the backend ecosystem on {new Date().toLocaleDateString()}.
                                                    </p>
                                                </div>
                                            </div> */}
                                        </div>

                                        {/* Action Buttons at the Bottom */}
                                        <div className="mt-12 flex flex-col md:flex-row gap-4 pt-8 border-t border-white/5">
                                            <button
                                                disabled={isUpdatingStatus !== null}
                                                onClick={() => handleVideoStatusUpdate(
                                                    selectedVideoDetails.uuid || selectedVideoDetails.video_id,
                                                    selectedVideoDetails.status === 'published' ? 'archived' : 'published'
                                                )}
                                                className={`flex-1 py-4 rounded-2xl font-black italic uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 border shadow-xl active:scale-[0.98] ${selectedVideoDetails.status === 'published'
                                                    ? 'bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500 hover:text-white'
                                                    : 'bg-lime-400/10 text-lime-400 border-lime-400/20 hover:bg-lime-400 hover:text-black'
                                                    }`}
                                            >
                                                {isUpdatingStatus ? (
                                                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                ) : selectedVideoDetails.status === 'published' ? (
                                                    <>
                                                        <Trash2 size={18} />
                                                        <span>Archive Content</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 size={18} />
                                                        <span>Publish Content</span>
                                                    </>
                                                )}
                                            </button>

                                            <button
                                                onClick={() => setVideoToMarkTop(selectedVideoDetails)}
                                                className={`flex-1 py-4 rounded-2xl font-black italic uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] border ${selectedVideoDetails.is_top === 1 ? 'bg-blue-500 text-white border-blue-400 cursor-default' : 'bg-white text-black hover:bg-lime-400 border-white hover:border-lime-400'}`}
                                            >
                                                <TrendingUp size={18} />
                                                <span>{selectedVideoDetails.is_top === 1 ? 'Marked as Top' : 'Mark as Top'}</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-[500px] text-center">
                                        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6">
                                            <Shield size={40} />
                                        </div>
                                        <h3 className="text-xl font-black italic uppercase tracking-tight text-white mb-2">Access Denied</h3>
                                        <p className="text-gray-500 text-sm max-w-xs font-medium">Unable to retrieve the requested asset details from the encrypted cloud storage.</p>
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
                            <button
                                onClick={() => isDeletingPost === null && setPostToDelete(null)}
                                disabled={isDeletingPost !== null}
                                style={{ transform: 'none' }}
                                className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer text-xs font-bold border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <X size={14} />
                                <span>Close</span>
                            </button>
                            <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                                <Trash2 size={40} />
                            </div>

                            <h3 className={`text-2xl font-black italic uppercase tracking-tight ${text} mb-2`}>Delete Post?</h3>
                            <p className={`${textMuted} font-medium mb-8`}>This action cannot be undone. Once deleted, this post will be permanently removed from the ecosystem.</p>

                            <div className="flex w-full gap-4">
                                <button
                                    onClick={() => setPostToDelete(null)}
                                    className={`flex-1 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 ${text} font-bold transition-all border border-white/5 hover:border-white/20 active:scale-95`}
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

                {/* Mark as Top Confirmation Modal */}
                {videoToMarkTop && (
                    <div className="absolute inset-0 z-[60] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setVideoToMarkTop(null)}></div>

                        <div className="relative w-full max-w-md glass-card rounded-[2rem] p-8 animate-scale-in border border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.1)] flex flex-col items-center text-center">
                            <button
                                onClick={() => !isMarkingTop && setVideoToMarkTop(null)}
                                disabled={isMarkingTop}
                                style={{ transform: 'none' }}
                                className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer text-xs font-bold border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <X size={14} />
                                <span>Close</span>
                            </button>
                            <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500 mb-6 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                                <TrendingUp size={40} />
                            </div>

                            <h3 className={`text-2xl font-black italic uppercase tracking-tight ${text} mb-2`}>Mark as Top?</h3>
                            <p className={`${textMuted} font-medium mb-8`}>Are you sure you want to mark this video as a top featured workout?</p>

                            <div className="flex w-full gap-4">
                                <button
                                    onClick={() => setVideoToMarkTop(null)}
                                    className={`flex-1 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 ${text} font-bold transition-all border border-white/5 hover:border-white/20 active:scale-95`}
                                >
                                    No, Cancel
                                </button>
                                <button
                                    onClick={handleMarkAsTop}
                                    disabled={isMarkingTop}
                                    className="flex-1 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isMarkingTop ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <CheckCircle2 size={18} /> Yes, Mark Top
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Global Toast */}
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </main>
        </div>
    );
}
