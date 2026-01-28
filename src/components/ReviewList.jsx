import { useState, useEffect } from 'react';
import { MessageSquare, User, Clock, Loader2, ChevronDown } from 'lucide-react';
import PropTypes from 'prop-types';
import StarRating from './StarRating';
import * as reviewsApi from '../api/reviews';

export default function ReviewList({ shopId, refreshKey }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchReviews = async (page = 1) => {
    setLoading(true);
    try {
      const response = await reviewsApi.getShopReviews(shopId, page, 10);
      setReviews(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(currentPage);
  }, [shopId, currentPage, refreshKey]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const getInteractionLabel = (type) => {
    const labels = {
      'walk-in': 'Walk-in Customer',
      'online-inquiry': 'Online Inquiry',
      'repeat-customer': 'Repeat Customer',
      'other': 'Customer',
    };
    return labels[type] || 'Customer';
  };

  if (loading && currentPage === 1) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
        <p className="text-gray-500 font-bold">Loading reviews...</p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100 border-dashed">
        <MessageSquare className="w-14 h-14 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 font-bold">No reviews yet</p>
        <p className="text-sm text-gray-400 mt-2">
          Be the first to share your experience with this boutique!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Grid */}
      <div className="grid gap-6">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-white" />
                </div>

                {/* User Info */}
                <div>
                  <div className="font-bold text-gray-900">
                    {review.user?.name || 'Anonymous Shopper'}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating value={review.rating} readonly size="small" />
                    {review.interactionType && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs font-medium text-gray-500">
                          {getInteractionLabel(review.interactionType)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                <Clock className="w-3 h-3" />
                {formatDate(review.createdAt)}
              </div>
            </div>

            {/* Review Text */}
            {review.reviewText && (
              <p className="text-gray-700 leading-relaxed font-medium pl-16">
                {review.reviewText}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-6 py-3 bg-white border-2 border-gray-200 rounded-2xl font-bold text-gray-700 hover:border-amber-500 hover:text-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`
                  w-10 h-10 rounded-xl font-bold transition
                  ${
                    currentPage === page
                      ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-amber-500'
                  }
                `}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(pagination.pages, prev + 1))}
            disabled={currentPage === pagination.pages}
            className="px-6 py-3 bg-white border-2 border-gray-200 rounded-2xl font-bold text-gray-700 hover:border-amber-500 hover:text-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Loading More */}
      {loading && currentPage > 1 && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-6 h-6 text-amber-600 animate-spin" />
        </div>
      )}
    </div>
  );
}

ReviewList.propTypes = {
  shopId: PropTypes.string.isRequired,
  refreshKey: PropTypes.number,
};
