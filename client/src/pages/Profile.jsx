import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useImages } from '../hooks/useImages';
import ImageGrid from '../components/ImageGrid';
import Spinner from '../components/Spinner';

const Profile = () => {
  const { user } = useAuth();
  const { userImages, loading, getUserImages, deleteImage } = useImages();

  useEffect(() => {
    getUserImages();
  }, []);

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Profile</h1>
        <div className="mb-4">
          <p><span className="font-semibold">Username:</span> {user.username}</p>
          <p><span className="font-semibold">Email:</span> {user.email}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6">My Uploads</h2>
        {loading ? (
          <Spinner />
        ) : (
          <ImageGrid images={userImages} onDelete={deleteImage} />
        )}
      </div>
    </div>
  );
};

export default Profile;
