import { useState, useEffect } from 'react';
import api from '../../api/axios';

const ManageUsers = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users.php');
            setUsers(response.data.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (userId: number, action: 'approve' | 'suspend' | 'activate' | 'reject') => {
        setActionLoading(userId);
        setMessage('');
        try {
            await api.post('/admin/users.php', {
                action: action,
                user_id: userId
            });
            setMessage(`User ${action}d successfully`);
            fetchUsers();
        } catch (error) {
            setMessage(`Failed to ${action} user`);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-8">Manage Users</h1>
            {message && <div className={`p-4 rounded mb-6 ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{message}</div>}

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{user.email}</div>
                                    <div className="text-sm text-gray-500">ID: {user.id}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${user.status === 'active' ? 'bg-green-100 text-green-800' :
                                            user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    {user.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleAction(user.id, 'approve')}
                                                disabled={actionLoading === user.id}
                                                className="text-green-600 hover:text-green-900 font-bold"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleAction(user.id, 'reject')}
                                                disabled={actionLoading === user.id}
                                                className="text-red-600 hover:text-red-900 ml-2"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {user.status === 'active' && (
                                        <button
                                            onClick={() => handleAction(user.id, 'suspend')}
                                            disabled={actionLoading === user.id}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Suspend
                                        </button>
                                    )}
                                    {user.status === 'suspended' && (
                                        <button
                                            onClick={() => handleAction(user.id, 'activate')}
                                            disabled={actionLoading === user.id}
                                            className="text-green-600 hover:text-green-900"
                                        >
                                            Activate
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
