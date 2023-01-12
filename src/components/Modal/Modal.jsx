import PropTypes from 'prop-types';

import { useEffect } from 'react';

export const Modal = ({ img, escFunction, closeModal }) => {
  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);
    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [escFunction]);

  return (
    <div className="Overlay" onClick={closeModal} onKeyDown={escFunction}>
      <div className="Modal">
        <img src={img.largeImageURL} alt={img.tags} loading="lazy" />
      </div>
    </div>
  );
};

Modal.propTypes = {
  img: PropTypes.object.isRequired,
  escFunction: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};
