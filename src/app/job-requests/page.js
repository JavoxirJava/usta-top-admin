'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { jobRequestApi } from '@/services/jobRequestApi'
import { notificationApi } from '@/services/notificationApi'

export default function JobRequestsPage() {
    const [jobRequests, setJobRequests] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchJobRequests = async () => {
        try {
            setLoading(true)
            const res = await jobRequestApi.getMy()
            setJobRequests(res.data)
        } catch (err) {
            console.error(err)
            toast.error('Failed to load job requests')
        } finally {
            setLoading(false)
        }
    }

    const handleAction = async (id, action) => {
        try {
            if (action === 'accept') {
                await jobRequestApi.accept(id)
                toast.success('Job request accepted')
            } else {
                await jobRequestApi.reject(id)
                toast.success('Job request rejected')
            }
            fetchJobRequests()
        } catch (err) {
            console.error(err)
            toast.error('Action failed')
        }
    }

    useEffect(() => {
        fetchJobRequests()
    }, [])

    return (
        <div className="max-w-3xl mx-auto p-6 mt-20">
            <h1 className="text-2xl font-bold mb-6">Job Requests</h1>

            {loading ? (
                <p>Loading...</p>
            ) : jobRequests.length === 0 ? (
                <p>No job requests</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {jobRequests.map((job) => (
                        <div key={job.id} className="p-4 border rounded-xl shadow-sm flex justify-between items-center">
                            <div>
                                <h2 className="font-medium">{job.title}</h2>
                                <p className="text-gray-600">{job.description}</p>
                                <p className="text-gray-500 text-sm mt-1">
                                    Budget: {job.budget} sum | Location: {job.location}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                {job.status === 'ACCEPTED' ? (
                                    <span className="px-3 py-1 bg-green-200 text-green-800 rounded">Accepted</span>
                                ) : job.status === 'REJECTED' ? (
                                    <span className="px-3 py-1 bg-red-200 text-red-800 rounded">Rejected</span>
                                ) : (
                                    <>
                                        <button
                                            className="px-3 py-1 bg-green-500 text-white rounded"
                                            onClick={() => handleAction(job.id, 'accept')}
                                        >
                                            Accept
                                        </button>
                                        <button
                                            className="px-3 py-1 bg-red-500 text-white rounded"
                                            onClick={() => handleAction(job.id, 'reject')}
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
