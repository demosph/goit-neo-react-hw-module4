import { useState, useEffect } from 'react';
import { fetchGallery } from './api/api-gallery';
import SearchBar from './components/SearchBar/SearchBar';
import ImageGallery from './components/ImageGallery/ImageGallery';
import Loader from './components/Loader/Loader';
import LoadMoreButton from './components/LoadMoreButton/LoadMoreButton';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import ImageModal from './components/ImageModal/ImageModal';

function App() {
  const [images, setImages] = useState([]);
  const [totalPages, setTotalPages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);

  // Виконання запиту при зміні сторінки або запиту
  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchGallery(query, page);
        if (page === 1) {
          setImages(data.results);
        } else {
          setImages(prevState => [...prevState, ...data.results]);
        }
        setTotalPages(data.total_pages);
      } catch (error) {
        setError(error);
        setImages([]);
        setTotalPages(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [query, page]);

  const handleSearch = newQuery => {
    setQuery(newQuery);
    setPage(1);  // Повертаємося на першу сторінку при новому пошуку
  };

  const handleOpenModal = selectedImage => {
    setIsOpenModal(true);
    setSelectedImage(selectedImage);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);  // Оновлюємо лише стан сторінки
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {images.length > 0 && <ImageGallery images={images} onClick={handleOpenModal} />}
      {error && <ErrorMessage />}
      {isLoading && <Loader />}
      {!isLoading && page < totalPages && totalPages !== null && !error && (
        <LoadMoreButton onClick={handleLoadMore} />
      )}
      <ImageModal
        image={selectedImage}
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
      />
    </>
  );
}

export default App;