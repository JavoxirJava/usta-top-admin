'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import FormInput from '../../../../../components/FormInput';
import SelectField from '../../../../../components/SelectField';
import { usersApi } from '../../../../../services/usersApi';
import { regionsApi } from '../../../../../services/regionsApi';

export default function EditUserPage() {
    const router = useRouter();
    const params = useParams();
    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState(null);

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