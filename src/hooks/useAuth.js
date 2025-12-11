    'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function useAuth() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            router.push('/login');
        } else {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, [router]);

    const logout = () => {
        localStorage.clear('authToken')
        router.push('/login')
    }

    return { isAuthenticated, loading, logout };
}
