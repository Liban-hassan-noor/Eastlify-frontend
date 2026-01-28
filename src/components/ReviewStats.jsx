import { useState, useEffect } from 'react';
import { Star, TrendingUp } from 'lucide-react';
import PropTypes from 'prop-types';
import StarRating from './StarRating';
import * as reviewsApi from '../api/reviews';

export default function ReviewStats({ shopId, refreshKey }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await reviewsApi.getReviewStats(shopId);
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch review stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [shopId, refreshKey]);

  if (loading) {
    return (
      <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm animate-pulse">
        <div className="h-20 bg-gray-100 rounded-2xl"></div>
      </div>
    );
  }

  if (!stats) return null;

  const { averageRating, totalReviews, ratingDistribution } = stats;

  // Calculate percentage for each rating
  const getPercentage = (count) => {
    if (totalReviews === 0) return 0;
    return Math.round((count / totalReviews) * 100);
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 rounded-2xl">
            <Star className="w-6 h-6 text-amber-600 fill-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900">Customer Reviews</h3>
            <p className="text-sm text-gray-500 font-medium">
              Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>
        </div>
      </div>

      {/* Average Rating Display */}
      <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-100">
        <div className="text-center min-w-[100px]">
          <div className="text-5xl font-black text-gray-900 mb-2">
            {totalReviews > 0 ? averageRating.toFixed(1) : '—'}
          </div>
          <StarRating value={averageRating} readonly size="medium" />
        </div>

        {totalReviews > 0 && (
          <div className="flex-1 min-w-[150px]">
            <div className="flex items-center gap-2 text-sm font-bold text-green-600">
              <TrendingUp className="w-4 h-4" />
              Community Trusted
            </div>
            <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">
              {totalReviews} Eastleigh {totalReviews === 1 ? 'shopper has' : 'shoppers have'} shared their experience
            </p>
          </div>
        )}
      </div>

      {/* Rating Distribution */}
      {totalReviews > 0 && (
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingDistribution[rating] || 0;
            const percentage = getPercentage(count);

            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-bold text-gray-700">{rating}</span>
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                </div>
                
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                <div className="w-12 text-right">
                  <span className="text-xs font-bold text-gray-500">
                    {count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* No Reviews State */}
      {totalReviews === 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
            <Star className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-sm font-bold text-gray-500">
            No reviews yet
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Be the first to share your experience!
          </p>
        </div>
      )}
    </div>
  );
}

ReviewStats.propTypes = {
  shopId: PropTypes.string.isRequired,
  refreshKey: PropTypes.number,
};
