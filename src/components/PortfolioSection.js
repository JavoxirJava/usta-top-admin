"use client";

import { url } from '@/lib/apiClient';
import { commentsApi } from '@/services/commentsApi';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CommentSection } from './CommentSection';
import { GlassCard } from './GlassCard';

export function PortfolioSection({ portfolios }) {
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPort, setSelectedPort] = useState([])
  // Portfolio bosilganda modal ochish
  const handlePortfolioClick = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setShowModal(true);
  };

  // Modal yopish
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPortfolio(null);
    setComments([]);
  };
  // Modal ochilganda commentlarni yuklash
  useEffect(() => {
    if (selectedPortfolio) {
      fetchComments(selectedPortfolio?.id);
    }
  }, [selectedPortfolio]);
  // Commentlarni yuklash
  async function fetchComments(portfolioId) {
    console.log('Fetching comments for portfolio:', portfolioId); // Debug

    try {
      setLoading(true);
      const res = await commentsApi.getById(portfolioId); // portfolio uchun commentlar
      setComments(res.data || []);
      console.log(res.data, 'commwnratsa')
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };



  // Comment qo'shilgandan keyin commentlarni qayta yuklash
  const handleCommentAdded = () => {
    if (selectedPortfolio) {
      fetchComments(selectedPortfolio?.id);
    }
  };

  return (
    <>
      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {portfolios.map((project, i) => (
          <GlassCard
            key={project.id}
            className="group cursor-pointer p-3"
            hoverEffect
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            onClick={() => {
              handlePortfolioClick(project)
              setSelectedPort(project.id)
            }}
          >
            <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-4">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10" />
              <motion.img
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
                src={`${url}${project.images}`}
                alt={project.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 z-20 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-wider text-gray-800">
                {project.name}
              </div>

              {/* Comment indicator */}
              <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-md rounded-lg text-xs">
                <MessageCircle size={12} />
                <span>View Details</span>
              </div>
            </div>

            <div className="px-2 pb-2">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {project.description}
              </h3>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Portfolio Detail Modal */}
      <AnimatePresence>
        {showModal && selectedPortfolio && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto pointer-events-auto">
                <GlassCard className="relative overflow-hidden bg-white/90 backdrop-blur-2xl shadow-2xl">
                  <button
                    onClick={handleCloseModal}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors z-10"
                  >
                    <X size={24} />
                  </button>

                  <div className="flex flex-col lg:flex-row">
                    {/* Left Column - Image */}
                    <div className="lg:w-1/2 p-6">
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
                        <img
                          src={`${url}${selectedPortfolio.images}`}
                          alt={selectedPortfolio.description}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="mt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {selectedPortfolio.name}
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                          {selectedPortfolio.description}
                        </h2>
                        {selectedPortfolio.details && (
                          <p className="text-gray-600 leading-relaxed">
                            {selectedPortfolio.details}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right Column - Comments */}
                    <div className="lg:w-1/2 p-6 border-t lg:border-t-0 lg:border-l border-gray-200/50 bg-white/20">
                      <div className="flex items-center gap-2 mb-6">
                        <MessageCircle size={24} className="text-blue-600" />
                        <h3 className="text-xl font-bold text-gray-900">Comments & Reviews</h3>
                      </div>

                      {loading ? (
                        <div className="text-center py-8 text-gray-500">
                          Loading comments...
                        </div>
                      ) : (
                        <CommentSection
                          portfolio_id={selectedPort}
                          comments={comments}
                          onAddComment={handleCommentAdded}
                          portfolioId={selectedPortfolio.id}
                        />
                      )}
                    </div>
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}