import { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, Loader2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    link: string | null;
    is_read: boolean;
    created_at: string;
}

const NotificationBell = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("NotificationBell: Component mounted");
        fetchNotifications();

        // Poll for new notifications every 30 seconds
        const interval = setInterval(() => {
            console.log("NotificationBell: Polling for new notifications");
            fetchNotifications();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/candidate/notifications.php?limit=10');
            console.log("NotificationBell: Fetched notifications", response.data);

            if (response.data.status === 'success') {
                setNotifications(response.data.data.notifications);
                setUnreadCount(response.data.data.unread_count);
                console.log(`NotificationBell: ${response.data.data.unread_count} unread notifications`);
            }
        } catch (error) {
            console.error('NotificationBell: Failed to fetch notifications', error);
        }
    };

    const markAsRead = async (id?: number) => {
        console.log(`NotificationBell: Marking ${id ? 'notification ' + id : 'all notifications'} as read`);
        setLoading(true);

        try {
            await api.put('/candidate/notifications.php', {
                action: 'mark_read',
                ...(id && { id })
            });

            if (id) {
                setNotifications(prev =>
                    prev.map(notif => notif.id === id ? { ...notif, is_read: true } : notif)
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            } else {
                setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })));
                setUnreadCount(0);
            }

            console.log("NotificationBell: Marked as read successfully");
        } catch (error) {
            console.error('NotificationBell: Failed to mark as read', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteNotification = async (id: number) => {
        console.log(`NotificationBell: Deleting notification ${id}`);
        try {
            await api.delete('/candidate/notifications.php', { data: { id } });
            setNotifications(prev => prev.filter(notif => notif.id !== id));
            console.log("NotificationBell: Deleted successfully");
        } catch (error) {
            console.error('NotificationBell: Failed to delete', error);
        }
    };

    const getNotificationIcon = (type: string) => {
        const icons: { [key: string]: string } = {
            application_status: '📋',
            profile_view: '👀',
            new_job: '💼',
            message: '💬',
            interview: '📅',
            system: '⚙️'
        };
        return icons[type] || '🔔';
    };

    const getTypeColor = (type: string) => {
        const colors: { [key: string]: string } = {
            application_status: 'bg-blue-50 text-blue-600 border-blue-200',
            profile_view: 'bg-green-50 text-green-600 border-green-200',
            new_job: 'bg-purple-50 text-purple-600 border-purple-200',
            message: 'bg-yellow-50 text-yellow-600 border-yellow-200',
            interview: 'bg-red-50 text-red-600 border-red-200',
            system: 'bg-gray-50 text-gray-600 border-gray-200'
        };
        return colors[type] || 'bg-gray-50 text-gray-600 border-gray-200';
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => {
                    console.log("NotificationBell: Toggling dropdown");
                    setIsOpen(!isOpen);
                }}
                className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-50"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                    >
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
                            <div>
                                <h3 className="font-bold text-gray-900">Notifications</h3>
                                <p className="text-xs text-gray-500">{unreadCount} unread</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={() => markAsRead()}
                                        disabled={loading}
                                        className="text-xs text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                                    >
                                        Mark all read
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-white rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="text-center py-12">
                                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 font-medium">No notifications</p>
                                    <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
                                </div>
                            ) : (
                                <div>
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                                                !notif.is_read ? 'bg-blue-50/30' : ''
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                {/* Icon */}
                                                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl border ${getTypeColor(notif.type)}`}>
                                                    {getNotificationIcon(notif.type)}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">
                                                            {notif.title}
                                                        </h4>
                                                        {!notif.is_read && (
                                                            <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1"></div>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                                                        {notif.message}
                                                    </p>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <span className="text-xs text-gray-400">
                                                            {formatTime(notif.created_at)}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            {notif.link && (
                                                                <Link
                                                                    to={notif.link}
                                                                    onClick={() => {
                                                                        console.log(`NotificationBell: Navigating to ${notif.link}`);
                                                                        setIsOpen(false);
                                                                        if (!notif.is_read) markAsRead(notif.id);
                                                                    }}
                                                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                                                >
                                                                    View
                                                                    <ExternalLink className="w-3 h-3" />
                                                                </Link>
                                                            )}
                                                            {!notif.is_read && (
                                                                <button
                                                                    onClick={() => markAsRead(notif.id)}
                                                                    className="text-xs text-green-600 hover:text-green-700 font-medium"
                                                                    title="Mark as read"
                                                                >
                                                                    <Check className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => deleteNotification(notif.id)}
                                                                className="text-xs text-red-600 hover:text-red-700"
                                                                title="Delete"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                                <Link
                                    to="/candidate/notifications"
                                    onClick={() => {
                                        console.log("NotificationBell: View all clicked");
                                        setIsOpen(false);
                                    }}
                                    className="block text-center text-sm text-blue-600 hover:text-blue-700 font-semibold"
                                >
                                    View All Notifications
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
