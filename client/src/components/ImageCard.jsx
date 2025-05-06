import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const ImageCard = ({ image, onDelete }) => {
  const { user } = useAuth();
  const [showDetails, setShowDetails] = useState(false);

  // Ensure the image URL has the correct base path
  const getFullImageUrl = (url) => {
    // If the URL already begins with http:// or https://, it's already a full URL
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If the URL is relative (e.g., /uploads/filename.jpg), ensure it has the correct path
    if (!url.startsWith('/')) {
      return `/${url}`;
    }
    return url;
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img 
          src={getFullImageUrl(image.imageUrl)} 
          alt={image.title} 
          className="w-full h-48 object-cover cursor-pointer" 
          onClick={toggleDetails}
        />
        {user && user.id === image.user._id && (
          <button
            onClick={() => onDelete(image._id)}
            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 focus:outline-none"
            title="Delete image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800">{image.title}</h3>
        {showDetails && (
          <div className="mt-2">
            {image.description && (
              <p className="text-gray-600 text-sm">{image.description}</p>
            )}
            <p className="text-gray-500 text-xs mt-2">
              Uploaded by {image.user.username || 'Unknown'}
            </p>
            <p className="text-gray-500 text-xs">
              {new Date(image.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCard;