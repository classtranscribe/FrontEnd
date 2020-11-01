import React, { useEffect } from 'react';
import cx from 'classnames';
import { uurl } from 'utils/use-url';
import { epub } from '../../controllers';
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
  enableChapterScreenshots,
  onChooseImage,
  onRemoveImage
}) {
  const { alt, src, description } = image;

  const onSave = (newImage) => {
    if (onChooseImage) {
      onChooseImage(newImage);
    }
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

  const openImagePicker = () => {
    const epubData = epub.data.data;
    const imgData = {
      screenshots: epubData.images,
      onSave: onSrcChange,
      defaultImage: src
    };
    if (enableChapterScreenshots) {
      imgData.chapterScreenshots = epubData.chapters[epub.state.currChIndex].allImagesWithIn;
    }
    epub.state.setImgPickerData(imgData);
  };

  useEffect(() => {
    epub.state.setImgPickerData(null);
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
    </>
  );
}

export default ChapterImage;