'use client';
import { useState, useEffect, useRef } from 'react';
import Table from '../../../components/Table';
import FormInput from '../../../components/FormInput';
import SelectField from '../../../components/SelectField';
import { portfoliosApi } from '../../../services/portfoliosApi';
import { portfolioImagesApi } from '../../../services/portfolioImagesApi';
import { UploadCloud, X } from 'lucide-react';
import { toast } from 'sonner';

export default function PortfoliosPage() {
    const [portfolios, setPortfolios] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        user_id: ''
    });

    // Upload states
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [portfoliosResponse, imagesResponse] = await Promise.all([
                portfoliosApi.getAll(),
                portfolioImagesApi.getAll()
            ]);
            setPortfolios(portfoliosResponse.data || []);
            setImages(imagesResponse.data || []);
        } catch (err) {
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    // Portfolio Handlers
    const handleDeletePortfolio = async (id) => {
        if (window.confirm('Are you sure you want to delete this portfolio?')) {
            try {
                await portfoliosApi.delete(id);
                fetchData();
                toast.success('Portfolio deleted');
            } catch {
                toast.error('Failed to delete portfolio');
            }
        }
    };

    const handleEditPortfolio = (portfolio) => {
        setEditingId(portfolio.id);
        setFormData({
            name: portfolio.name,
            description: portfolio.description,
            user_id: portfolio.user_id
        });
        setShowForm(true);
        setShowUploadForm(false);
    };

    const handleSubmitPortfolio = async (e) => {
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
            toast.success('Portfolio saved successfully');
        } catch {
            toast.error('Failed to save portfolio');
        }
    };

    // Upload Handlers
    const handleFileSelect = (files) => {
        const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
        if (validFiles.length + selectedFiles.length > 5) {
            toast.error('You can upload maximum 5 images per portfolio');
            return;
        }
        setSelectedFiles(prev => [...prev, ...validFiles]);
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const handleFileInputChange = (e) => {
        if (e.target.files) {
            handleFileSelect(e.target.files);
        }
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleUploadImages = async () => {
        if (!selectedPortfolioId) {
            toast.error('Select a portfolio first');
            return;
        }
        if (selectedFiles.length === 0) {
            toast.error('Select images to upload');
            return;
        }

        setUploading(true);
        try {
            const formDataObj = new FormData();
            selectedFiles.forEach(file => formDataObj.append('images', file));
            formDataObj.append('portfolio_id', selectedPortfolioId);

            await portfolioImagesApi.upload(formDataObj);

            toast.success('Images uploaded successfully');
            setSelectedFiles([]);
            setPreviews([]);
            setShowUploadForm(false);
            setSelectedPortfolioId(null);
            fetchData();
        } catch {
            toast.error('Failed to upload images');
        } finally {
            setUploading(false);
        }
    };

    // Table Columns
    const portfolioColumns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
        { key: 'user_id', label: 'User ID' },
        {
            key: 'images',
            label: 'Images',
            render: (row) => (
                <div className="flex gap-2 flex-wrap">
                    {images
                        .filter(img => img?.portfolio_id === row?.id)
                        .map(img => (
                            <img
                                key={img?.id}
                                src={img?.url}
                                alt={`img-${img?.id}`}
                                className="w-12 h-12 object-cover rounded"
                            />
                        ))}
                </div>
            )
        },
    ];

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <div className="p-6">
            {/* Header Buttons */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Portfolios</h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            setShowUploadForm(true);
                            setShowForm(false);
                            setSelectedPortfolioId(null);
                            setSelectedFiles([]);
                            setPreviews([]);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                        <UploadCloud className="w-4 h-4" />
                        Upload Images
                    </button>
                    <button
                        onClick={() => {
                            setShowForm(true);
                            setShowUploadForm(false);
                            setEditingId(null);
                            setFormData({ name: '', description: '', user_id: '' });
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Create New Portfolio
                    </button>
                </div>
            </div>

            {/* Portfolio Form */}
            {showForm && (
                <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">
                        {editingId ? 'Edit Portfolio' : 'New Portfolio'}
                    </h2>
                    <form onSubmit={handleSubmitPortfolio}>
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

            {/* Upload Form */}
            {showUploadForm && (
                <div className="mb-6 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                    <h2 className="text-xl font-bold mb-4">Upload Images</h2>

                    {/* Portfolio select */}
                    <SelectField
                        label="Select Portfolio"
                        name="portfolio_id"
                        value={selectedPortfolioId || ''}
                        onChange={(e) => setSelectedPortfolioId(e.target.value)}
                        options={portfolios.map(p => ({ value: p.id, label: p.name }))}
                        required
                    />

                    {/* File input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileInputChange}
                        className="hidden"
                    />
                    <div
                        className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 mt-4"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <p className="text-gray-500">Click or drag images here (Max 5)</p>
                    </div>

                    {/* Preview */}
                    <div className="flex gap-2 mt-4 flex-wrap">
                        {previews.map((src, idx) => (
                            <div key={idx} className="relative">
                                <img src={src} alt="preview" className="w-24 h-24 object-cover rounded" />
                                <button
                                    onClick={() => removeFile(idx)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Upload / Cancel buttons */}
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={handleUploadImages}
                            disabled={uploading || selectedFiles.length === 0 || !selectedPortfolioId}
                            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                        >
                            {uploading ? 'Uploading...' : 'Upload Images'}
                        </button>
                        <button
                            onClick={() => {
                                setShowUploadForm(false);
                                setSelectedFiles([]);
                                setPreviews([]);
                                setSelectedPortfolioId(null);
                            }}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Portfolios Table */}
            <Table onEdit={handleEditPortfolio} columns={portfolioColumns} data={portfolios} />
        </div>
    );
}
