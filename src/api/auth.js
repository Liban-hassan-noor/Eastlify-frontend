const API_URL = import.meta.env.VITE_API_URL 

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Registration failed');
    error.status = response.status;
    throw error;
  }

  return data;
};

export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Login failed');
    error.status = response.status;
    throw error;
  }

  return data;
};

export const getProfile = async (token) => {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Failed to fetch profile');
    error.status = response.status;
    throw error;
  }

  return data;
};

export const updateProfile = async (userData, token) => {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Update profile failed');
    error.status = response.status;
    throw error;
  }

  return data;
};
