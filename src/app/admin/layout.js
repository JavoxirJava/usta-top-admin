'use client';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import useAuth from '../../hooks/useAuth';

export default function AdminLayout({ children }) {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1">
                <TopBar />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}

