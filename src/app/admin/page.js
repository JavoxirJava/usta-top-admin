'use client';

export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Welcome</h2>
                    <p className="text-gray-600">Select a menu item to manage data</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Quick Stats</h2>
                    <p className="text-gray-600">Manage users, regions, and more</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">System</h2>
                    <p className="text-gray-600">All systems operational</p>
                </div>
            </div>
        </div>
    );
}