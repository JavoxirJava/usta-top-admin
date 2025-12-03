'use client';
import { useState, useEffect } from 'react';
import Table from '../../../components/Table';
import FormInput from '../../../components/FormInput';
import SelectField from '../../../components/SelectField';
import { userInfosApi } from '../../../services/userInfosApi';
import { usersApi } from '../../../services/usersApi';
import { categoriesApi } from '../../../services/categoriesApi';

export default function UserInfosPage() {
    const [userInfos, setUserInfos] = useState([]);
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        user_id: '',
        category_id: '',
        price: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [infoResponse, usersResponse, categoriesResponse] = await Promise.all([
                userInfosApi.getAll(),
                usersApi.getAll(),
                categoriesApi.getAll(),
            ]);
            setUserInfos(infoResponse.data);
            setUsers(usersResponse.data);
            setCategories(categoriesResponse.data);
        } catch (err) {
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user info?')) {
            try {
                await userInfosApi.delete(id);
                fetchData();
            } catch (err) {
                alert('Failed to delete user info');
            }
        }
    };

    const handleEdit = (info) => {
        setEditingId(info.id);
        setFormData({
            user_id: info.user_id,
            category_id: info.category_id,
            price: info.price
        });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await userInfosApi.update(editingId, formData);
            } else {
                await userInfosApi.create(formData);
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ user_id: '', category_id: '', price: '' });
            fetchData();
        } catch (err) {
            alert('Failed to save user info');
        }
    };

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'user_id', label: 'User ID' },
        { key: 'category_id', label: 'Category ID' },
        { key: 'price', label: 'Price' },
    ];

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">User Infos</h1>
                <button
                    onClick={() => {
                        setShowForm(true);
                        setEditingId(null);
                        setFormData({ user_id: '', category_id: '', price: '' });
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Create New User Info
                </button>
            </div>

            {showForm && (
                <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">
                        {editingId ? 'Edit User Info' : 'New User Info'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <SelectField
                            label="User"
                            name="user_id"
                            value={formData.user_id}
                            onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                            options={users.map(u => ({
                                value: u.id,
                                label: `${u.first_name} ${u.last_name}`
                            }))}
                            required
                        />
                        <SelectField
                            label="Category"
                            name="category_id"
                            value={formData.category_id}
                            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                            options={categories.map(c => ({ value: c.id, label: c.name }))}
                            required
                        />
                        <FormInput
                            label="Price"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                        />
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                {editingId ? 'Update' : 'Create'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingId(null);
                                    setFormData({ user_id: '', category_id: '', price: '' });
                                }}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <Table
                columns={columns}
                data={userInfos}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}