import React, { useEffect } from 'react';
import { connect } from 'dva'
import cx from 'classnames';
import { uurl } from 'utils/use-url';
import Image from 'components/Image';
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
  onRemoveImage,
  currChIndex,
  epub,
  images,
  dispatch
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
    const imgData = {
      screenshots: images,
      onSave: onSrcChange,
      defaultImage: src
    };
    if (enableChapterScreenshots) {
      imgData.chapterScreenshots = epub.chapters[currChIndex].allImagesWithIn;
    }
    dispatch({ type: 'epub/setImgPickerData', payload: imgData });
  };

  useEffect(() => {
    dispatch({ type: 'epub/setImgPickerData', payload: null });
  }, [image]);
  // console.log(epub);
  const imgConClasses = cx('ct-epb', 'ch-img-con');
  const dispatchChange = (newEpub) => {
    // console.log(newEpub);
    dispatch({ type: 'epub/setEPub', payload: newEpub });
  }
  return (
    <>
      {image ? (
        <div id={id} className={imgConClasses}>
          <div className="ct-epb ch-img">
            <Image src={uurl.getMediaUrl(src)} alt={alt} />
            <ImageWrapper
              epub={epub}
              id={id}
              imageAlt={alt}
              chapter={epub.chapters[currChIndex]}
              onChooseImage={openImagePicker}
              onRemoveImage={onRemoveImage}
              onImageAltChange={onAltChange}
              onLinkChange={dispatchChange}
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

export default connect(({ epub: { currChIndex, epub, images }, loading }) => ({
  currChIndex, images, epub
}))(ChapterImage);