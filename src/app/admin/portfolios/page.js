'use client';
import { usersApi } from '@/services/usersApi';
import { UploadCloud, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import FormInput from '../../../components/FormInput';
import Table from '../../../components/Table';
import { portfolioImagesApi } from '../../../services/portfolioImagesApi';
import { portfoliosApi } from '../../../services/portfoliosApi';
import { useRouter } from 'next/navigation';


export default function PortfoliosPage() {
    const [portfolios, setPortfolios] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [users, setUsers] = useState([]);

    // Image upload states
    const [files, setFiles] = useState([]);
    const inputRef = useRef(null);

    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        user_id: ''
    });

    useEffect(() => {
        fetchData();
        fetchUsers();
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

    /// Fetch Images

    const onSelectFiles = (e) => {
        const selected = Array.from(e.target.files).slice(0, 5);
        setFiles(selected);
    };

    const removeFileOne = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const onDrop = (e) => {
        e.preventDefault();
        const dropped = Array.from(e.dataTransfer.files)
            .filter(f => f.type.startsWith('image/'))
            .slice(0, 5);
        setFiles(dropped);
    };

    async function handleFileUpload(portfolioId) {
        try {
            const fd = new FormData();
            files.forEach(f => fd.append('images', f));
            fd.append('portfolio_id', portfolioId);
            await portfolioImagesApi.upload(fd);
            toast.success('Image uploaded successfully!');
            setFiles([]);
            if (inputRef.current) inputRef.current.value = '';
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to upload image');
        }
    }
    /// Fetch Images end

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
                const response = await portfoliosApi.create(formData);
                await handleFileUpload(response.data.id);
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
                    {row}
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
        {
            key: 'id',
            label: 'id',
            render: (row) => (
                <button
                    onClick={() => router.push(`/portfolio/${row}/images`)}
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer"
                >
                    Preview Images
                </button>
            )
        }
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
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                User <span className="text-red-500">*</span>
                            </label>
                            <select name="user_id" value={formData.user_id} onChange={(e) => setFormData({ ...formData, user_id: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select User</option>
                                {users.filter(user => user.role === 'USER').map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.first_name} {user.last_name} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <FormInput
                            label="Portfolio Name"
                            name="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="4"
                            />
                        </div>
                        <div className="mb-4">
                            <div className="mb-6 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                                <p className="text-md font-bold mb-4">Upload Portfolio Image</p>
                                <div className="space-y-4">
                                    {/* Upload box */}
                                    <div
                                        onClick={() => inputRef.current.click()}
                                        onDrop={onDrop}
                                        onDragOver={(e) => e.preventDefault()}
                                        className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-blue-400"
                                    >
                                        <UploadCloud className="mx-auto w-8 h-8 text-blue-600" />
                                        <p className="text-sm mt-2">Click or drag (max 5 images)</p>

                                        <input
                                            ref={inputRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={onSelectFiles}
                                            className="hidden"
                                        />
                                    </div>

                                    {/* Preview grid */}
                                    {files.length > 0 && (
                                        <div className="grid grid-cols-5 gap-3">
                                            {files.map((file, i) => (
                                                <div key={i} className="relative">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        className="h-50 w-full object-cover rounded-lg"
                                                    />
                                                    <button
                                                        onClick={() => removeFileOne(i)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                </div>

                            </div>
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

            {/* Portfolios Table */}
            <Table onEdit={handleEditPortfolio} columns={portfolioColumns} data={portfolios} />
        </div>
    );
}
