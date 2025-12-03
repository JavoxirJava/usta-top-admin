'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Table from '../../../components/Table';
import { usersApi } from '../../../services/usersApi';

export default function UsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await usersApi.getAll();
            setUsers(response.data);
        } catch (err) {
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await usersApi.delete(id);
                fetchUsers();
            } catch (err) {
                alert('Failed to delete user');
            }
        }
    };

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'first_name', label: 'First Name' },
        { key: 'last_name', label: 'Last Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone_number', label: 'Phone' },
        { key: 'role', label: 'Role' },
    ];

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Users</h1>
                <button
                    onClick={() => router.push('/admin/users/new')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Create New User
                </button>
            </div>
            <Table
                columns={columns}
                data={users}
                onEdit={(user) => router.push(`/admin/users/${user.id}/edit`)}
                onDelete={handleDelete}
            />
        </div>
    );
}