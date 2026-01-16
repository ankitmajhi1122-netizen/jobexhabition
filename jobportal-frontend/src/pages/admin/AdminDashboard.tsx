import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                    Admin Dashboard
                </h1>
                <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                    Manage users, view grievances, and oversee the platform.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Manage Users Card */}
                <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                            User Management
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                            Users
                        </dd>
                        <p className="mt-2 text-sm text-gray-600">
                            View and manage all registered users, companies, and consultancies.
                        </p>
                    </div>
                    <div className="bg-gray-50 px-4 py-4 sm:px-6">
                        <div className="text-sm">
                            <Link to="/admin/users" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Manage Users <span aria-hidden="true">&rarr;</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Grievances Card */}
                <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                            Support
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                            Grievances
                        </dd>
                        <p className="mt-2 text-sm text-gray-600">
                            View and resolve user grievances and support tickets.
                        </p>
                    </div>
                    <div className="bg-gray-50 px-4 py-4 sm:px-6">
                        <div className="text-sm">
                            <Link to="/admin/grievances" className="font-medium text-indigo-600 hover:text-indigo-500">
                                View Grievances <span aria-hidden="true">&rarr;</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
