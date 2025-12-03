'use client';
import { useState, useEffect } from 'react';
import Table from '../../../components/Table';
import FormInput from '../../../components/FormInput';
import SelectField from '../../../components/SelectField';
import { portfolioImagesApi } from '../../../services/portfolioImagesApi';
import { portfoliosApi } from '../../../services/portfoliosApi';

export default function PortfolioImagesPage() {
    const [images, setImages] = useState([]);
    const [portfolios, setPortfolios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        portfolio_id: '',
        image_id: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [imagesResponse, portfoliosResponse] = await Promise.all([
                portfolioImagesApi.getAll(),
                portfoliosApi.getAll(),
            ]);
            setImages(imagesResponse.data);
            setPortfolios(portfoliosResponse.data);
        } catch (err) {
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            try {
                await portfolioImagesApi.delete(id);
                fetchData();
            } catch (err) {
                alert('Failed to delete image');
            }
        }
    };

    const handleEdit = (image) => {
        setEditingId(image.id);
        setFormData({
            portfolio_id: image.portfolio_id,
            image_id: image.image_id
        });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await portfolioImagesApi.update(editingId, formData);
            } else {
                await portfolioImagesApi.create(formData);
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ portfolio_id: '', image_id: '' });
            fetchData();
        } catch (err) {
            alert('Failed to save image');
        }
    };

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'portfolio_id', label: 'Portfolio ID' },
        { key: 'image_id', label: 'Image ID' },
    ];

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Portfolio Images</h1>
                <button
                    onClick={() => {
                        setShowForm(true);
                        setEditingId(null);
                        setFormData({ portfolio_id: '', image_id: '' });
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Create New Image
                </button>
            </div>

            {showForm && (
                <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">
                        {editingId ? 'Edit Image' : 'New Image'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <SelectField
                            label="Portfolio"
                            name="portfolio_id"
                            value={formData.portfolio_id}
                            onChange={(e) => setFormData({ ...formData, portfolio_id: e.target.value })}
                            options={portfolios.map(p => ({ value: p.id, label: p.name }))}
                            required
                        />
                        <FormInput
                            label="Image ID"
                            name="image_id"
                            type="number"
                            value={formData.image_id}
                            onChange={(e) => setFormData({ ...formData, image_id: e.target.value })}
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
                                    setFormData({ portfolio_id: '', image_id: '' });
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
                data={images}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}