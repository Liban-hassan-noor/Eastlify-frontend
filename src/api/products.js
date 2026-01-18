import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL 

export const getProducts = async (filters = {}) => {
  const { category, shop, search } = filters;
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (shop) params.append('shop', shop);
  if (search) params.append('search', search);

  const response = await axios.get(`${API_URL}/products?${params.toString()}`);
  return response.data;
};

export const getProductById = async (id) => {
  const response = await axios.get(`${API_URL}/products/${id}`);
  return response.data;
};

export const getMyProducts = async (token) => {
  const response = await axios.get(`${API_URL}/products/my/products`, {
    headers: { Authorization: `Bearer ${token}` }
  });
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

export const createProduct = async (productData, token) => {
  const formData = new FormData();
  Object.keys(productData).forEach(key => {
    if (key === 'images') {
      productData.images.forEach((image, index) => {
        if (typeof image === 'string' && image.startsWith('data:')) {
          const blob = dataURLtoBlob(image);
          formData.append('images', blob, `product-image-${index}.${blob.type.split('/')[1]}`);
        } else if (image instanceof File || image instanceof Blob) {
          formData.append('images', image);
        }
      });
    } else if (key === 'tags' && Array.isArray(productData[key])) {
      formData.append(key, JSON.stringify(productData[key]));
    } else if (
      productData[key] !== null && 
      productData[key] !== undefined && 
      productData[key] !== 'null' && 
      productData[key] !== 'undefined'
    ) {
      formData.append(key, productData[key]);
    }
  });

  const response = await axios.post(`${API_URL}/products`, formData, {
    headers: { 
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const updateProduct = async (id, productData, token) => {
  const formData = new FormData();
  Object.keys(productData).forEach(key => {
    if (key === 'images') {
      productData.images.forEach((image, index) => {
        if (typeof image === 'string' && image.startsWith('data:')) {
          const blob = dataURLtoBlob(image);
          formData.append('images', blob, `product-image-${index}.${blob.type.split('/')[1]}`);
        } else if (image instanceof File || image instanceof Blob) {
          formData.append('images', image);
        } else if (typeof image === 'string' && image.startsWith('http')) {
          // If it's already an uploaded URL, we might need a way to keep it
          // For now, let's just pass it as a string if the backend handles it or handle in controller
          formData.append('existingImages', image);
        }
      });
    } else if (key === 'tags' && Array.isArray(productData[key])) {
      formData.append(key, JSON.stringify(productData[key]));
    } else if (
      productData[key] !== null && 
      productData[key] !== undefined && 
      productData[key] !== 'null' && 
      productData[key] !== 'undefined'
    ) {
      formData.append(key, productData[key]);
    }
  });

  const response = await axios.put(`${API_URL}/products/${id}`, formData, {
    headers: { 
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const deleteProduct = async (id, token) => {
  const response = await axios.delete(`${API_URL}/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
