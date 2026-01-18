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
    if (key === 'profileImage' || key === 'coverImage') {
      const img = shopData[key];
      if (typeof img === 'string' && img.startsWith('data:')) {
        const blob = dataURLtoBlob(img);
        formData.append(key, blob, `${key}.${blob.type.split('/')[1]}`);
      } else if (img instanceof File || img instanceof Blob) {
        formData.append(key, img);
      } else {
        formData.append(key, img);
      }
    } else if (key === 'categories' && Array.isArray(shopData[key])) {
      formData.append(key, JSON.stringify(shopData[key]));
    } else if (key === 'workingHours' && typeof shopData[key] === 'object') {
      formData.append(key, JSON.stringify(shopData[key]));
    } else {
      formData.append(key, shopData[key]);
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

