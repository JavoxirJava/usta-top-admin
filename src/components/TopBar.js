'use client';
import useAuth from '../hooks/useAuth';

export default function TopBar() {
    const { user, logout } = useAuth();

    
    return (
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <div>
                <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
            </div>
            <div className="flex items-center gap-4">
                {user && (
                    <span className="text-gray-600">
                        {user.email || 'Admin User'}
                    </span>
                )}
                <button
                    onClick={() => logout()}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
