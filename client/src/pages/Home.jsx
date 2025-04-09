import { useEffect } from 'react';
import { useImages } from '../hooks/useImages';
import ImageGrid from '../components/ImageGrid';
import Spinner from '../components/Spinner';

const Home = () => {
  const { images, loading, getAllImages, deleteImage } = useImages();

  useEffect(() => {
    getAllImages();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Image Gallery</h1>
      {loading ? (
        <Spinner />
      ) : (
        <ImageGrid images={images} onDelete={deleteImage} />
      )}
    </div>
  );
};

export default Home;
