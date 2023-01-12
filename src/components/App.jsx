import { useEffect, useState } from 'react';

import fetchPhotosWithQuery from 'api/api';

import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import { Modal } from './Modal/Modal';

export const App = () => {
  const [modalPicture, setModalPicture] = useState(null);
  const [page, setPage] = useState(0);
  const [hitsNumber, setHitsNumber] = useState(0);
  const [pictures, setPictures] = useState([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchQuery !== '') {
      DidUpdate();
    }

    async function DidUpdate() {
      setIsLoading(true);
      if (page > 1) {
        try {
          const pictures = await fetchPhotosWithQuery(searchQuery, page);
          setPictures(prevState => prevState.concat(pictures.hits));
        } catch (error) {
          setError(error);
        } finally {
          setIsLoading(false);
        }
      } else {
        try {
          const apiResult = await fetchPhotosWithQuery(searchQuery, page);
          if (apiResult.total === 0) {
            return alert('There is no images for your value 😢');
          } else {
            setPictures(apiResult.hits);
            setHitsNumber(apiResult.totalHits);
            return;
          }
        } catch (error) {
          setError(error);
        } finally {
          setIsLoading(false);
        }
      }
    }
  }, [searchQuery, page]);

  const pageChange = evt => {
    evt.preventDefault();
    setPage(prevState => prevState + 1);
  };

  const handleSubmit = evt => {
    evt.preventDefault();
    const form = evt.currentTarget;
    const searchValue = form.elements[1].value;
    if (searchValue === '') {
      return alert('Please, type any search request!');
    }
    if (searchValue !== searchQuery) {
      setPage(1);
      setSearchQuery(searchValue);
    } else {
      alert('You have already searched for that!');
    }
    form.reset();
  };

  const openModal = evt => {
    const ImgForModal = pictures.filter(
      picture => picture.id === Number(evt.target.id)
    );
    setModalPicture(ImgForModal[0]);
  };

  const escFunction = event => {
    if (event.key === 'Escape') {
      setModalPicture(null);
    }
  };

  const closeModal = evt => {
    if (evt.target === evt.currentTarget) {
      setModalPicture(null);
    }
  };

  return (
    <div className="App">
      <Searchbar onSubmit={handleSubmit} searchImgName={searchQuery} />
      {error && <p>Whoops, something went wrong 😢: {error.message}</p>}
      {hitsNumber > 0 && (
        <>
          {isLoading && <Loader />}
          <ImageGallery apiData={pictures} onClick={openModal} />
          {hitsNumber > 12 && page < 41 && pictures.length !== hitsNumber && (
            <Button handleClick={pageChange} />
          )}
          {modalPicture && (
            <Modal
              img={modalPicture}
              escFunction={escFunction}
              closeModal={closeModal}
            />
          )}
        </>
      )}
    </div>
  );
};
