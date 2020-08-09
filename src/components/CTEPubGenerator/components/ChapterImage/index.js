import React, { useState, useEffect } from 'react';
import { uurl } from 'utils/use-url';
import { ImagePicker } from '../ImagePicker';
import ImageWrapper from './ImageWrapper';
import './index.scss';

const NewImageButton = ({ openImagePicker, handleOnKeyDown }) => (
  <div className="ct-epb ch-text-con">
    <div
      className="ct-epb ch-text clickable"
      tabIndex={0}
      onClick={openImagePicker}
      onKeyDown={handleOnKeyDown}
      role="button"
    >
      <div className="text-muted">Click to insert images</div>
    </div>
  </div>
);

export function ChapterImage({
  id,
  image = '',
  imageAlt = '',
  screenshots = [],
  chapterScreenshots = [],
  onChooseImage,
  onRemoveImage
}) {
  const [pickImg, setPickImage] = useState(false);

  const openImagePicker = () => setPickImage(true);
  const closeImagePicker = () => setPickImage(false);

  const onSave = (newImage) => {
    if (onChooseImage) {
      onChooseImage(newImage);
    }

    closeImagePicker();
  };

  const handleOnKeyDown = ({ keyCode }) => {
    if (keyCode === 13 || keyCode === 32) {
      openImagePicker();
    }
  };

  useEffect(() => {
    if (pickImg) {
      setPickImage(false);
    }
  }, [image]);

  return (
    <>
      {image ? (
        <div id={id} className="ct-epb ch-img-con">
          <img src={uurl.getMediaUrl(image)} alt="Cover" />
          <ImageWrapper 
            id={id} 
            imageAlt={imageAlt}
            onChooseImage={openImagePicker} 
            onRemoveImage={onRemoveImage}
          />
        </div>
      ) : (
        <NewImageButton 
          openImagePicker={openImagePicker} 
          handleOnKeyDown={handleOnKeyDown}
        />
      )}

      <ImagePicker
        show={pickImg}
        onSave={onSave}
        onClose={closeImagePicker}
        defaultImage={image}
        screenshots={screenshots}
        chapterScreenshots={chapterScreenshots}
      />
    </>
  );
}
