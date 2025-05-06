import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const useImages = () => {
  const [images, setImages] = useState([]);
  const [userImages, setUserImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Base API URL - get from environment or use default
  const API_URL = '/api';

  // Get all images
  const getAllImages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/images/all`);
      setImages(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch images');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get user's images
  const getUserImages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/images/user`);
      setUserImages(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user images');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Upload image
  const uploadImage = async (formData) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUserImages([res.data, ...userImages]);
      toast.success('Image uploaded successfully');
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Image upload failed';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete image
  const deleteImage = async (id) => {
    try {
      await axios.delete(`${API_URL}/images/${id}`);
      setUserImages(userImages.filter(image => image._id !== id));
      setImages(images.filter(image => image._id !== id));
      toast.success('Image deleted successfully');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete image';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return {
    images,
    userImages,
    loading,
    error,
    getAllImages,
    getUserImages,
    uploadImage,
    deleteImage,
    clearError
  };
};