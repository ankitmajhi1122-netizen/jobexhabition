import { useAuth } from '../../auth/AuthContext';
import { Link } from 'react-router-dom';

const ConsultancyDashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Consultancy Dashboard</h1>
                        <p className="text-gray-600">Welcome, {user?.name || 'Recruiter'}</p>
                    </div>
                    <button onClick={logout} className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200">
                        Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Link to="/consultancy/post-job" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                        <div className="text-primary mb-4">
                            <span className="material-icons text-4xl">add_circle</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Post New Job</h3>
                        <p className="text-gray-600">Create a new job listing</p>
                    </Link>

                    <Link to="/consultancy/my-jobs" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                        <div className="text-primary mb-4">
                            <span className="material-icons text-4xl">list</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">My Jobs</h3>
                        <p className="text-gray-600">Manage posted jobs & View Applicants</p>
                    </Link>

                    <Link to="/company/profile" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                        <div className="text-primary mb-4">
                            <span className="material-icons text-4xl">business</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Company Profile</h3>
                        <p className="text-gray-600">Update consultancy details</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ConsultancyDashboard;
