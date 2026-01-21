import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL 

export const getShops = async (filters = {}) => {
  const { category, street, search } = filters;
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (street) params.append('street', street);
  if (search) params.append('search', search);

  const response = await axios.get(`${API_URL}/shops?${params.toString()}`);
  return response.data;
};

export const getShopById = async (id) => {
  const response = await axios.get(`${API_URL}/shops/${id}`);
  return response.data;
};

// Helper to convert dataURL to Blob
const dataURLtoBlob = (dataurl) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

export const updateShop = async (id, shopData, token) => {
  const formData = new FormData();
  Object.keys(shopData).forEach(key => {
    const value = shopData[key];
    
    // Skip undefined or "undefined"/"null" strings
    if (value === undefined || value === 'undefined' || value === 'null') {
      return;
    }

    if (key === 'profileImage' || key === 'coverImage') {
      if (typeof value === 'string' && value.startsWith('data:')) {
        const blob = dataURLtoBlob(value);
        formData.append(key, blob, `${key}.${blob.type.split('/')[1]}`);
      } else if (value instanceof File || value instanceof Blob) {
        formData.append(key, value);
      } else if (value === '' || value === null) {
        // Explicitly send empty string to clear the image
        formData.append(key, '');
      } else if (typeof value === 'string' && value.startsWith('http')) {
        // Keep existing URL -> Send as "existingKey" to mirror product logic
        // Capitalize the first letter of the key for the new key name
        const existingKey = `existing${key.charAt(0).toUpperCase() + key.slice(1)}`;
        formData.append(existingKey, value);
      }
    } else if (key === 'categories' && Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else if (key === 'workingHours' && typeof value === 'object' && value !== null) {
      formData.append(key, JSON.stringify(value));
    } else if (value !== null) {
      formData.append(key, value);
    }
  });

  const response = await axios.put(`${API_URL}/shops/${id}`, formData, {
    headers: { 
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
export const getMyShop = async (token) => {
  const response = await axios.get(`${API_URL}/shops/my/shop`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteShop = async (id, token) => {
  const response = await axios.delete(`${API_URL}/shops/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const recordActivity = async (shopId, activityData) => {
  const response = await axios.post(`${API_URL}/shops/${shopId}/activity`, activityData);
  return response.data;
};

export const recordSale = async (shopId, saleData, token) => {
  const response = await axios.post(`${API_URL}/shops/${shopId}/sale`, { ...saleData, type: 'sale' }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const fetchActivities = async (shopId, token) => {
  const response = await axios.get(`${API_URL}/shops/${shopId}/activities`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

