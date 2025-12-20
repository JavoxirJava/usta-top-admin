'use client';

import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { GlassButton } from '@/components/GlassButton';
import { PageTransition } from '@/components/PageTransition';
import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';

export default function JobRequestsPage() {
  const [jobRequests, setJobRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobRequests = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/job-requests/my');
      const data = res.data;

      // Normalize response to always be an array
      if (Array.isArray(data)) {
        setJobRequests(data);
      } else if (Array.isArray(data?.jobRequests)) {
        setJobRequests(data.jobRequests);
      } else {
        console.error('Unexpected job requests response format:', data);
        setJobRequests([]);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch job requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await apiClient.patch(`/job-requests/${id}/accept`);
      toast.success('Job request accepted');
      fetchJobRequests();
    } catch (err) {
      console.error(err);
      toast.error('Failed to accept request');
    }
  };

  const handleReject = async (id) => {
    try {
      await apiClient.patch(`/job-requests/${id}/reject`);
      toast.success('Job request rejected');
      fetchJobRequests();
    } catch (err) {
      console.error(err);
      toast.error('Failed to reject request');
    }
  };

  useEffect(() => {
    fetchJobRequests();
  }, []);

  return (
    <PageTransition className="min-h-screen pt-32 px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">Job Requests</h1>

        {loading && <p className="text-gray-500 text-lg">Loading...</p>}

        {!loading && jobRequests.length === 0 && (
          <p className="text-gray-500 text-lg">No job requests found</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobRequests.map((job) => (
            <GlassCard key={job.id} className="p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
                <p className="text-gray-700 mt-2">{job.description}</p>
                <p className="text-gray-500 text-sm mt-1">
                  Location: {job.location || 'N/A'}
                </p>
                <p className="text-gray-500 text-sm mt-1">Budget: ${job.budget}</p>
                <p className="text-gray-500 text-sm mt-1">
                  Status: <span className="font-semibold">{job.status}</span>
                </p>
              </div>

              {job.status === 'PENDING' && (
                <div className="mt-4 flex gap-2">
                  <GlassButton
                    variant="secondary"
                    className="w-full"
                    onClick={() => handleAccept(job.id)}
                  >
                    Accept
                  </GlassButton>
                  <GlassButton
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleReject(job.id)}
                  >
                    Reject
                  </GlassButton>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
