import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';
import StarRating from './StarRating';
import * as reviewsApi from '../api/reviews';

export default function ReviewForm({ shopId, shopName, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    rating: 0,
    reviewText: '',
    interactionType: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await reviewsApi.createReview({
        shopId,
        rating: formData.rating,
        reviewText: formData.reviewText.trim(),
        interactionType: formData.interactionType || undefined,
      });

      // Success!
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error('Failed to submit review:', err);
      setError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const characterCount = formData.reviewText.length;
  const maxCharacters = 1000;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-[3rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 rounded-t-[3rem] flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900">
              Help the Eastleigh Community!
            </h2>
            <p className="text-gray-500 font-medium mt-1">
              How was your experience at {shopName}?
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Rating */}
          <div className="space-y-3">
            <label className="block text-sm font-black text-gray-700 uppercase tracking-wider">
              Your Rating *
            </label>
            <div className="flex items-center gap-4">
              <StarRating
                value={formData.rating}
                onChange={(rating) => setFormData({ ...formData, rating })}
                size="large"
              />
              {formData.rating > 0 && (
                <span className="text-2xl font-black text-amber-600">
                  {formData.rating}.0
                </span>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-3">
            <label htmlFor="reviewText" className="block text-sm font-black text-gray-700 uppercase tracking-wider">
              Your Review (Optional)
            </label>
            <textarea
              id="reviewText"
              value={formData.reviewText}
              onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
              placeholder="Was the price fair? Was the shopkeeper helpful? Share details to help others avoid the commotion."
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition resize-none font-medium text-gray-700"
              rows={5}
              maxLength={maxCharacters}
            />
            <div className="flex items-center justify-between text-xs">
              <span className={`font-bold ${characterCount > maxCharacters * 0.9 ? 'text-amber-600' : 'text-gray-400'}`}>
                {characterCount} / {maxCharacters} characters
              </span>
            </div>
          </div>

          {/* Interaction Type */}
          <div className="space-y-3">
            <label htmlFor="interactionType" className="block text-sm font-black text-gray-700 uppercase tracking-wider">
              How did you interact? (Optional)
            </label>
            <select
              id="interactionType"
              value={formData.interactionType}
              onChange={(e) => setFormData({ ...formData, interactionType: e.target.value })}
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition font-medium text-gray-700 bg-white"
            >
              <option value="">Select interaction type</option>
              <option value="walk-in">Walk-in customer</option>
              <option value="online-inquiry">Online inquiry</option>
              <option value="repeat-customer">Repeat customer</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          {/* Trust Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <p className="text-xs text-amber-900 leading-relaxed font-medium">
              <strong className="font-black">Please be honest.</strong> Fake or malicious reviews may be removed. 
              Your voice helps keep Eastleigh shopping fair and safe.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 px-6 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || formData.rating === 0}
              className="flex-1 py-4 px-6 bg-amber-600 text-white rounded-2xl font-black hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-600/20"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

ReviewForm.propTypes = {
  shopId: PropTypes.string.isRequired,
  shopName: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
};
