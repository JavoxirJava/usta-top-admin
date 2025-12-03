'use client';
import { useState, useEffect } from 'react';
import Table from '../../../components/Table';
import FormInput from '../../../components/FormInput';
import SelectField from '../../../components/SelectField';
import { portfoliosApi } from '../../../services/portfoliosApi';
import { usersApi } from '../../../services/usersApi';

export default function PortfoliosPage() {
    const [portfolios, setPortfolios] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        user_id: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [portfoliosResponse, usersResponse] = await Promise.all([
                portfoliosApi.getAll(),
                usersApi.getAll(),
            ]);
            setPortfolios(portfoliosResponse.data);
            setUsers(usersResponse.data);
        } catch (err) {
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this portfolio?')) {
            try {
                await portfoliosApi.delete(id);
                fetchData();
            } catch (err) {
                alert('Failed to delete portfolio');
            }
        }
    };

    const handleEdit = (portfolio) => {
        setEditingId(portfolio.id);
        setFormData({
            name: portfolio.name,
            description: portfolio.description,
            user_id: portfolio.user_id
        });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await portfoliosApi.update(editingId, formData);
            } else {
                await portfoliosApi.create(formData);
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ name: '', description: '', user_id: '' });
            fetchData();
        } catch (err) {
            alert('Failed to save portfolio');
        }
    };

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
        { key: 'user_id', label: 'User ID' },
    ];

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Portfolios</h1>
                <button
                    onClick={() => {
                        setShowForm(true);
                        setEditingId(null);
                        setFormData({ name: '', description: '', user_id: '' });
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Create New Portfolio
                </button>
            </div>

            {showForm && (
                <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">
                        {editingId ? 'Edit Portfolio' : 'New Portfolio'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <FormInput
                            label="Portfolio Name"
                            name="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="4"
                            />
                        </div>
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
                                    setFormData({ name: '', description: '', user_id: '' });
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
                data={portfolios}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}