'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../../../lib/apiClient';
import { GlassCard } from '@/components/GlassCard';
import { GlassButton } from '@/components/GlassButton';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    password: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await apiClient.post('/api/auth/register', formData);
      const { token, user } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      user.role === 'ADMIN' ? router.push('/admin') : router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <GlassCard className="w-full max-w-md p-8 md:p-12 space-y-6">
        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-4">
            <h1 className="text-3xl font-bold text-center mb-4">Register</h1>
            {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}

            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/50"
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/50"
            />
            <input
              type="text"
              name="phone_number"
              placeholder="Phone +998 XX XXX XXXX"
              value={formData.phone_number}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setFormData({ ...formData, phone_number: val });
              }}
              maxLength={9}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/50"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/50"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/50"
            />

            <GlassButton type="submit" className="w-full">
              Next
            </GlassButton>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Who are you?</h2>
            <p className="text-gray-500 text-center">Choose one option</p>

            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={() => handleRoleSelect('MASTER')}
                className={`cursor-pointer p-6 rounded-xl border-2 ${
                  formData.role === 'MASTER'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-white'
                } text-center font-semibold`}
              >
                Worker
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={() => handleRoleSelect('USER')}
                className={`cursor-pointer p-6 rounded-xl border-2 ${
                  formData.role === 'USER'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-white'
                } text-center font-semibold`}
              >
                Work Finder
              </motion.div>
            </div>

            <div className="flex justify-between">
              <GlassButton variant="secondary" onClick={() => setStep(1)}>
                Back
              </GlassButton>
              <GlassButton
                onClick={handleSubmit}
                disabled={!formData.role || loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </GlassButton>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
