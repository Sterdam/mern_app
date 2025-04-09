import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImages } from '../hooks/useImages';
import { toast } from 'react-toastify';

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
      setFile(selectedFile);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select an image');
      return;
    }

    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
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
