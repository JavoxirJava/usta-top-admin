'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FormInput from '../../../../components/FormInput';
import SelectField from '../../../../components/SelectField';
import { usersApi } from '../../../../services/usersApi';
import { regionsApi } from '../../../../services/regionsApi';

export default function NewUserPage() {
    const router = useRouter();
    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        age: '',
        phone_number: '',
        email: '',
        password: '',
        role: 'user',
        lat: '',
        lon: '',
        image_id: '',
        experience: '',
        experience_type: 'year',
        is_priumium: false,
        work_start: '',
        work_end: '',
        work_type: 'online',
        region_id: '',
    });

    useEffect(() => {
        fetchRegions();
    }, []);

    const fetchRegions = async () => {
        try {
            const response = await regionsApi.getAll();
            setRegions(response.data);
        } catch (err) {
            console.error('Failed to fetch regions');
        }
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
        setLoading(true);
        setError('');

        try {
            await usersApi.create(formData);
            router.push('/admin/users');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Create New User</h1>

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
                    value={formData.age}
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
                <FormInput
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <SelectField
                    label="Role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    options={[
                        { value: 'user', label: 'User' },
                        { value: 'admin', label: 'Admin' },
                    ]}
                />
                <FormInput
                    label="Latitude"
                    name="lat"
                    value={formData.lat}
                    onChange={handleChange}
                />
                <FormInput
                    label="Longitude"
                    name="lon"
                    value={formData.lon}
                    onChange={handleChange}
                />
                <FormInput
                    label="Experience"
                    name="experience"
                    type="number"
                    value={formData.experience}
                    onChange={handleChange}
                />
                <SelectField
                    label="Experience Type"
                    name="experience_type"
                    value={formData.experience_type}
                    onChange={handleChange}
                    options={[
                        { value: 'year', label: 'Year' },
                        { value: 'month', label: 'Month' },
                    ]}
                />
                <SelectField
                    label="Work Type"
                    name="work_type"
                    value={formData.work_type}
                    onChange={handleChange}
                    options={[
                        { value: 'online', label: 'Online' },
                        { value: 'offline', label: 'Offline' },
                        { value: 'both', label: 'Both' },
                    ]}
                />
                <SelectField
                    label="Region"
                    name="region_id"
                    value={formData.region_id}
                    onChange={handleChange}
                    options={regions.map(r => ({ value: r.id, label: r.name }))}
                />

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? 'Creating...' : 'Create User'}
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