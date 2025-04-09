import ImageCard from './ImageCard';

const ImageGrid = ({ images, onDelete }) => {
  if (!images || images.length === 0) {
    return <p className="text-center text-gray-500 mt-8">No images found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {images.map((image) => (
        <ImageCard key={image._id} image={image} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default ImageGrid;
