import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { uurl } from 'utils/use-url';
import { ImagePicker } from '../ImagePicker';
import ChapterEditButton from '../ChapterEditButton';
import ImageWrapper from './ImageWrapper';
import ImageDescription from './ImageDescription';
import './index.scss';

const NewImageButton = ({ onClick }) => (
  <ChapterEditButton muted onClick={onClick}>
    Click to insert images
  </ChapterEditButton>
);

export function ChapterImage({
  id,
  image = '',
  imageAlt = '',
  disableDescription,
  screenshots = [],
  chapterScreenshots = [],
  onChooseImage,
  onRemoveImage,
  onChangeImageAlt,
  onChangeImageDescription
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

  useEffect(() => {
    if (pickImg) {
      setPickImage(false);
    }
  }, [image]);

  const imgConClasses = cx('ct-epb', 'ch-img-con');

  return (
    <>
      {image ? (
        <div id={id} className={imgConClasses}>
          <div className="ct-epb ch-img">
            <img src={uurl.getMediaUrl(image)} alt={imageAlt} />
            <ImageWrapper 
              id={id} 
              imageAlt={imageAlt}
              onChooseImage={openImagePicker} 
              onRemoveImage={onRemoveImage}
            />
          </div>
          {
            !disableDescription
            &&
            <ImageDescription id={id} description="" />
          }
        </div>
      ) : (
        <NewImageButton onClick={openImagePicker} />
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
