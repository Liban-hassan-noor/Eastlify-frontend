import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create a new review
export const createReview = async (reviewData) => {
  const response = await axios.post(`${API_URL}/reviews`, reviewData);
  return response.data;
};

// Get reviews for a specific shop
export const getShopReviews = async (shopId, page = 1, limit = 10, sort = '-createdAt') => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sort,
  });
  
  const response = await axios.get(`${API_URL}/reviews/shop/${shopId}?${params.toString()}`);
  return response.data;
};

// Get review statistics for a shop
export const getReviewStats = async (shopId) => {
  const response = await axios.get(`${API_URL}/reviews/shop/${shopId}/stats`);
  return response.data;
};

// Flag a review for moderation
export const flagReview = async (reviewId, reason) => {
  const response = await axios.post(`${API_URL}/reviews/${reviewId}/flag`, { reason });
  return response.data;
};
