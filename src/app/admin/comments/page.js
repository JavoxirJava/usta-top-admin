'use client';
import { useState, useEffect } from 'react';
import Table from '../../../components/Table';
import FormInput from '../../../components/FormInput';
import SelectField from '../../../components/SelectField';
import { commentsApi } from '../../../services/commentsApi';
import { portfoliosApi } from '../../../services/portfoliosApi';

export default function CommentsPage() {
    const [comments, setComments] = useState([]);
    const [portfolios, setPortfolios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        comment: '',
        level: '',
        portfolio_id: '',
        sendir_email: '',
        sendir_name: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [commentsResponse, portfoliosResponse] = await Promise.all([
                commentsApi.getAll(),
                portfoliosApi.getAll(),
            ]);
            setComments(commentsResponse.data);
            setPortfolios(portfoliosResponse.data);
        } catch (err) {
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await commentsApi.delete(id);
                fetchData();
            } catch (err) {
                alert('Failed to delete comment');
            }
        }
    };

    const handleEdit = (comment) => {
        setEditingId(comment.id);
        setFormData({
            comment: comment.comment,
            level: comment.level || '',
            portfolio_id: comment.portfolio_id,
            sendir_email: comment.sendir_email,
            sendir_name: comment.sendir_name
        });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                ...formData,
                level: formData.level || null,
            };
            if (editingId) {
                await commentsApi.update(editingId, dataToSend);
            } else {
                await commentsApi.create(dataToSend);
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({
                comment: '',
                level: '',
                portfolio_id: '',
                sendir_email: '',
                sendir_name: ''
            });
            fetchData();
        } catch (err) {
            alert('Failed to save comment');
        }
    };

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'comment', label: 'Comment' },
        { key: 'sendir_name', label: 'Sender Name' },
        { key: 'sendir_email', label: 'Sender Email' },
        { key: 'portfolio_id', label: 'Portfolio ID' },
    ];

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Comments</h1>
                <button
                    onClick={() => {
                        setShowForm(true);
                        setEditingId(null);
                        setFormData({
                            comment: '',
                            level: '',
                            portfolio_id: '',
                            sendir_email: '',
                            sendir_name: ''
                        });
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Create New Comment
                </button>
            </div>

            {showForm && (
                <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">
                        {editingId ? 'Edit Comment' : 'New Comment'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Comment <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="comment"
                                value={formData.comment}
                                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="4"
                            />
                        </div>
                        <FormInput
                            label="Level"
                            name="level"
                            type="number"
                            value={formData.level}
                            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        />
                        <SelectField
                            label="Portfolio"
                            name="portfolio_id"
                            value={formData.portfolio_id}
                            onChange={(e) => setFormData({ ...formData, portfolio_id: e.target.value })}
                            options={portfolios.map(p => ({ value: p.id, label: p.name }))}
                            required
                        />
                        <FormInput
                            label="Sender Email"
                            name="sendir_email"
                            type="email"
                            value={formData.sendir_email}
                            onChange={(e) => setFormData({ ...formData, sendir_email: e.target.value })}
                            required
                        />
                        <FormInput
                            label="Sender Name"
                            name="sendir_name"
                            value={formData.sendir_name}
                            onChange={(e) => setFormData({ ...formData, sendir_name: e.target.value })}
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
                                    setFormData({
                                        comment: '',
                                        level: '',
                                        portfolio_id: '',
                                        sendir_email: '',
                                        sendir_name: ''
                                    });
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
                data={comments}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}