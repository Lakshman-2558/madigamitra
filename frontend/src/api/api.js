import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Admin login
export const adminLogin = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/login`, {
      username,
      password
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

// Upload profile
export const uploadProfile = async (file, category, token) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', category);

    const response = await axios.post(`${API_BASE_URL}/admin/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Upload failed' };
  }
};

// Get all profiles
export const getAllProfiles = async (token, filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const response = await axios.get(`${API_BASE_URL}/admin/profiles?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch profiles' };
  }
};

// Delete profile
export const deleteProfile = async (profileId, token) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/admin/profiles/${profileId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Delete failed' };
  }
};

// Search profiles (public)
export const searchProfiles = async (query) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Search failed' };
  }
};

// Get public profiles by category (public)
export const getPublicProfiles = async (category) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/profiles`, {
      params: { category }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch public profiles' };
  }
};
