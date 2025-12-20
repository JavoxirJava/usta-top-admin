'use client';
import { useState, useEffect, useRef } from 'react';
import Table from '../../../components/Table';
import FormInput from '../../../components/FormInput';
import SelectField from '../../../components/SelectField';
import { portfolioImagesApi } from '../../../services/portfolioImagesApi';
import { portfoliosApi } from '../../../services/portfoliosApi';
import { UploadCloud, X } from 'lucide-react';
import { toast } from 'sonner';

export default function PortfolioImagesPage() {
    const [images, setImages] = useState([]);
    const [portfolios, setPortfolios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        portfolio_id: '',
        image_id: ''
    });
    
    // Upload states
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

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
            toast.success('Image saved successfully');
        } catch (err) {
            toast.error('Failed to save image');
        }
    };

    // Upload handlers
    const handleFileSelect = (file) => {
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            toast.error('Please select a valid image file');
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileInputChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error('Please select an image file');
            return;
        }

        if (!formData.portfolio_id) {
            toast.error('Please select a portfolio');
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            const uploadFormData = new FormData();
            uploadFormData.append('image', selectedFile);
            uploadFormData.append('portfolio_id', formData.portfolio_id);

            const response = await portfolioImagesApi.upload(uploadFormData);
            
            toast.success('Image uploaded successfully!');
            setShowUploadForm(false);
            setSelectedFile(null);
            setPreview(null);
            setFormData({ portfolio_id: '', image_id: '' });
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to upload image');
        } finally {
            setUploading(false);
            setUploadProgress(0);
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
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Portfolio Images</h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            setShowUploadForm(true);
                            setShowForm(false);
                            setEditingId(null);
                            setFormData({ portfolio_id: '', image_id: '' });
                            setSelectedFile(null);
                            setPreview(null);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                        <UploadCloud className="w-4 h-4" />
                        Upload Image
                    </button>
                    <button
                        onClick={() => {
                            setShowForm(true);
                            setShowUploadForm(false);
                            setEditingId(null);
                            setFormData({ portfolio_id: '', image_id: '' });
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Create New Image
                    </button>
                </div>
            </div>

            {/* Upload Form */}
            {showUploadForm && (
                <div className="mb-6 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Upload Portfolio Image</h2>
                        <button
                            onClick={() => {
                                setShowUploadForm(false);
                                setSelectedFile(null);
                                setPreview(null);
                                setFormData({ portfolio_id: '', image_id: '' });
                                if (fileInputRef.current) {
                                    fileInputRef.current.value = '';
                                }
                            }}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Portfolio Selection */}
                        <div>
                            <SelectField
                                label="Portfolio"
                                name="portfolio_id"
                                value={formData.portfolio_id}
                                onChange={(e) => setFormData({ ...formData, portfolio_id: e.target.value })}
                                options={portfolios.map(p => ({ value: p.id, label: p.name || `Portfolio #${p.id}` }))}
                                required
                            />
                        </div>

                        {/* Upload Area */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Image File
                            </label>
                            {!preview ? (
                                <div
                                    className={`
                                        relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer
                                        ${dragActive ? 'border-blue-500 bg-blue-50/50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50/50'}
                                    `}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                                            <UploadCloud className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-medium text-gray-900">
                                                Click or drag image to upload
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                PNG, JPG, WEBP up to 10MB
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Select File
                                        </button>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileInputChange}
                                        className="hidden"
                                    />
                                </div>
                            ) : (
                                <div className="relative">
                                    <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="w-full h-64 object-cover"
                                        />
                                        <button
                                            onClick={removeFile}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {selectedFile && (
                                        <div className="mt-2 text-sm text-gray-600">
                                            <p className="font-medium">{selectedFile.name}</p>
                                            <p className="text-gray-500">
                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Upload Progress */}
                        {uploading && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Uploading...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Upload Button */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleUpload}
                                disabled={uploading || !selectedFile || !formData.portfolio_id}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {uploading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <UploadCloud className="w-4 h-4" />
                                        Upload Image
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowUploadForm(false);
                                    setSelectedFile(null);
                                    setPreview(null);
                                    setFormData({ portfolio_id: '', image_id: '' });
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = '';
                                    }
                                }}
                                disabled={uploading}
                                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

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