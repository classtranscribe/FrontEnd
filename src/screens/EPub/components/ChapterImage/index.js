import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { uurl } from 'utils/use-url';
import ImagePicker from '../ImagePicker';
import ChapterEditButton from '../ChapterEditButton';
import ImageWrapper from './ImageWrapper';
import ImageDescription from './ImageDescription';
import './index.scss';

const NewImageButton = ({ onClick }) => (
  <ChapterEditButton muted onClick={onClick}>
    Click to insert images
  </ChapterEditButton>
);

function ChapterImage({
  id,
  image = {},
  disableDescription,
  disableImagePicker,
  screenshots = [],
  chapterScreenshots = [],
  onChooseImage,
  onRemoveImage
}) {
  const { alt, src, description } = image;

  const [pickImg, setPickImage] = useState(false);

  const openImagePicker = () => setPickImage(true);
  const closeImagePicker = () => setPickImage(false);

  const onSave = (newImage) => {
    if (onChooseImage) {
      onChooseImage(newImage);
    }

    closeImagePicker();
  };

  const handleImageChange = (imgLike) => {
    onSave({ src, alt, description, ...imgLike });
  };

  const onSrcChange = (val) => {
    if (val !== src) handleImageChange({ src: val });
  };
  const onAltChange = (val) => {
    if (val !== alt) handleImageChange({ alt: val });
  };
  const onDescriptionChange = (val) => {
    if (val !== description) handleImageChange({ description: val });
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
            <img src={uurl.getMediaUrl(src)} alt={alt} />
            <ImageWrapper 
              id={id} 
              imageAlt={alt}
              onChooseImage={openImagePicker} 
              onRemoveImage={onRemoveImage}
              onImageAltChange={onAltChange}
              disabled={disableImagePicker}
            />
          </div>
          {
            !disableDescription
            &&
            <ImageDescription 
              id={id} 
              description={description}
              onChange={onDescriptionChange}
            />
          }
        </div>
      ) : (
        <NewImageButton onClick={openImagePicker} />
      )}

      <ImagePicker
        show={pickImg}
        onSave={onSrcChange}
        onClose={closeImagePicker}
        defaultImage={src}
        screenshots={screenshots}
        chapterScreenshots={chapterScreenshots}
      />
    </>
  );
}

export default ChapterImage;