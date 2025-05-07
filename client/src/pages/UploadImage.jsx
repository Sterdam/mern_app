import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImages } from '../hooks/useImages';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';

const UploadImage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { uploadImage } = useImages();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Invalid file type. Only JPEG, PNG, and GIF images are allowed.');
        e.target.value = '';
        return;
      }
      
      // Validate file size (5MB max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File is too large. Maximum size is 5MB.');
        e.target.value = '';
        return;
      }
      
      setFile(selectedFile);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const validateTitle = (title) => {
    return title.trim().length > 0 && title.trim().length <= 100;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select an image');
      return;
    }
    
    if (!validateTitle(formData.title)) {
      toast.error('Title is required and must be less than 100 characters');
      return;
    }

    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('title', DOMPurify.sanitize(formData.title));
      data.append('description', DOMPurify.sanitize(formData.description || ''));
      data.append('image', file);

      await uploadImage(data);
      toast.success('Image uploaded successfully');
      navigate('/profile');
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Upload Image</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength="100"
            className="input"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 mb-2">Description (optional)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input h-24"
            maxLength="500"
          ></textarea>
        </div>
        <div className="mb-6">
          <label htmlFor="image" className="block text-gray-700 mb-2">Image</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleFileChange}
            required
            accept="image/jpeg,image/png,image/gif"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Accepted formats: JPEG, PNG, GIF. Maximum size: 5MB.
          </p>
          {preview && (
            <div className="mt-4">
              <img src={preview} alt="Preview" className="w-full max-h-64 object-contain rounded-md" />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full btn-primary"
          disabled={isLoading || !file}
        >
          {isLoading ? 'Uploading...' : 'Upload Image'}
        </button>
      </form>
    </div>
  );
};

export default UploadImage;