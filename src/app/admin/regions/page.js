'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Table from '../../../components/Table';
import FormInput from '../../../components/FormInput';
import { regionsApi } from '../../../services/regionsApi';

export default function RegionsPage() {
    const router = useRouter();
    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '' });

    useEffect(() => {
        fetchRegions();
    }, []);

    const fetchRegions = async () => {
        try {
            const response = await regionsApi.getAll();
            setRegions(response.data);
        } catch (err) {
            setError('Failed to fetch regions');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this region?')) {
            try {
                await regionsApi.delete(id);
                fetchRegions();
            } catch (err) {
                alert('Failed to delete region');
            }
        }
    };

    const handleEdit = (region) => {
        setEditingId(region.id);
        setFormData({ name: region.name });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await regionsApi.update(editingId, formData);
            } else {
                await regionsApi.create(formData);
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ name: '' });
            fetchRegions();
        } catch (err) {
            alert('Failed to save region');
        }
    };

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
    ];

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Regions</h1>
                <button
                    onClick={() => {
                        setShowForm(true);
                        setEditingId(null);
                        setFormData({ name: '' });
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Create New Region
                </button>
            </div>

            {showForm && (
                <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">
                        {editingId ? 'Edit Region' : 'New Region'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <FormInput
                            label="Region Name"
                            name="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ name: e.target.value })}
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
                                    setFormData({ name: '' });
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
                data={regions}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}