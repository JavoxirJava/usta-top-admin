'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import FormInput from '@/components/FormInput';
import SelectField from '@/components/SelectField';
import { usersApi } from '@/services/usersApi';
import { regionsApi } from '@/services/regionsApi';
import { portfolioImagesApi } from '@/services/portfolioImagesApi';
import { Image, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function EditUserPage() {
    const router = useRouter();
    const params = useParams();
    const [regions, setRegions] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState(null);
    const [imagesLoading, setImagesLoading] = useState(false);
    const [showImageSelector, setShowImageSelector] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [userResponse, regionsResponse] = await Promise.all([
                usersApi.getById(params.id),
                regionsApi.getAll(),
            ]);
            setFormData(userResponse.data);
            setRegions(regionsResponse.data);
        } catch (err) {
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const fetchImages = async () => {
        setImagesLoading(true);
        try {
            const response = await portfolioImagesApi.getAll();
            setImages(response.data || []);
            setShowImageSelector(true);
        } catch (err) {
            toast.error('Failed to fetch images');
        } finally {
            setImagesLoading(false);
        }
    };

    const handleImageSelect = (imageId) => {
        setFormData({
            ...formData,
            image_id: imageId
        });
        setShowImageSelector(false);
        toast.success('Image selected successfully!');
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            await usersApi.update(params.id, formData);
            router.push('/admin/users');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update user');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error && !formData) return <div className="text-red-600">{error}</div>;
    if (!formData) return <div>User not found</div>;

    return (
        <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Edit User</h1>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                <FormInput
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    label="Age"
                    name="age"
                    type="number"
                    value={formData.age || ''}
                    onChange={handleChange}
                />
                <FormInput
                    label="Phone Number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <SelectField
                    label="Role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    options={[
                        { value: 'USER', label: 'User' },
                        { value: 'ADMIN', label: 'Admin' },
                        { value: 'MASTER', label: 'Master' },
                    ]}
                />
                <SelectField
                    label="Region"
                    name="region_id"
                    value={formData.region_id || ''}
                    onChange={handleChange}
                    options={regions.map(r => ({ value: r.id, label: r.name }))}
                />

                {/* Image Selection Section */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Profile Image
                    </label>
                    
                    {/* Current Image ID */}
                    {formData.image_id && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-700">
                                Current Image ID: <span className="font-semibold">{formData.image_id}</span>
                            </p>
                        </div>
                    )}

                    {/* Select Image Button */}
                    <button
                        type="button"
                        onClick={fetchImages}
                        disabled={imagesLoading}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {imagesLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Loading Images...
                            </>
                        ) : (
                            <>
                                <Image className="w-4 h-4" />
                                Select Image from Gallery
                            </>
                        )}
                    </button>

                    {/* Image Selector Modal */}
                    {showImageSelector && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                                <div className="p-4 border-b flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">Select Image</h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowImageSelector(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4">
                                    {images.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            No images available
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {images.map((image) => (
                                                <div
                                                    key={image.id}
                                                    onClick={() => handleImageSelect(image.id)}
                                                    className={`
                                                        relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all
                                                        ${formData.image_id == image.id 
                                                            ? 'border-blue-500 ring-2 ring-blue-200' 
                                                            : 'border-gray-200 hover:border-blue-300'
                                                        }
                                                    `}
                                                >
                                                    {image.url ? (
                                                        <img
                                                            src={image.url}
                                                            alt={`Image ${image.id}`}
                                                            className="w-full h-32 object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                                                            <Image className="w-8 h-8 text-gray-400" />
                                                        </div>
                                                    )}
                                                    {formData.image_id == image.id && (
                                                        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                                                            <Check className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2">
                                                        ID: {image.id}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Image ID Input (Manual) */}
                    <FormInput
                        label="Image ID (or select from gallery above)"
                        name="image_id"
                        type="number"
                        value={formData.image_id || ''}
                        onChange={handleChange}
                        placeholder="Enter image ID manually"
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/admin/users')}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}