'use client';
import { useState, useEffect } from 'react';
import Table from '../../../components/Table';
import FormInput from '../../../components/FormInput';
import SelectField from '../../../components/SelectField';
import { categoriesApi } from '../../../services/categoriesApi';

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', category_id: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await categoriesApi.getAll();
            setCategories(response.data);
        } catch (err) {
            setError('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await categoriesApi.delete(id);
                fetchCategories();
            } catch (err) {
                alert('Failed to delete category');
            }
        }
    };

    const handleEdit = (category) => {
        setEditingId(category.id);
        setFormData({
            name: category.name,
            category_id: category.category_id || ''
        });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                name: formData.name,
                category_id: formData.category_id || null,
            };
            if (editingId) {
                await categoriesApi.update(editingId, dataToSend);
            } else {
                await categoriesApi.create(dataToSend);
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ name: '', category_id: '' });
            fetchCategories();
        } catch (err) {
            alert('Failed to save category');
        }
    };

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        {
            key: 'category_id',
            label: 'Parent Category',
            render: (val) => val || 'None'
        },
    ];

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Categories</h1>
                <button
                    onClick={() => {
                        setShowForm(true);
                        setEditingId(null);
                        setFormData({ name: '', category_id: '' });
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Create New Category
                </button>
            </div>

            {showForm && (
                <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">
                        {editingId ? 'Edit Category' : 'New Category'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <FormInput
                            label="Category Name"
                            name="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <SelectField
                            label="Parent Category"
                            name="category_id"
                            value={formData.category_id}
                            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                            options={categories.map(c => ({ value: c.id, label: c.name }))}
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
                                    setFormData({ name: '', category_id: '' });
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
                data={categories}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}