import React from 'react';
import s from './ImageGalleryItem.module.css';

const ImageGalleryItem = ({ hit, setLargeImg }) => {
  const { webformatURL, tags } = hit;

  return (
    <li className={s.ImageGalleryItem} onClick={() => setLargeImg(hit)}>
      <img src={webformatURL} alt={tags} className={s.ImageGalleryItemImage} />
    </li>
  );
};

export default ImageGalleryItem;
