import { useState, useEffect } from 'react';
import api from '../../api/axios';

const Grievances = () => {
    const [grievances, setGrievances] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    useEffect(() => {
        fetchGrievances();
    }, []);

    const fetchGrievances = async () => {
        try {
            const response = await api.get('/admin/grievances.php');
            setGrievances(response.data.data);
        } catch (error) {
            console.error('Failed to fetch grievances', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (id: number) => {
        setActionLoading(id);
        try {
            await api.post('/admin/grievances.php', {
                action: 'resolve',
                id: id
            });
            fetchGrievances();
        } catch (error) {
            alert('Failed to resolve grievance');
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-8">Grievances</h1>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                {grievances.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">No grievances found.</div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {grievances.map((item) => (
                            <li key={item.id}>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-medium text-gray-900">{item.subject}</h3>
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${item.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-2">{item.message}</p>
                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                        <span>From User ID: {item.user_id}</span>
                                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                    </div>
                                    {item.status === 'open' && (
                                        <button
                                            onClick={() => handleResolve(item.id)}
                                            disabled={actionLoading === item.id}
                                            className="mt-2 text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                        >
                                            Mark as Resolved
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Grievances;
