import React from 'react';
import PropTypes from 'prop-types';
import { uurl } from 'utils/use-url';
import ImagePreview from './ImagePreview';

function ImagesTab(props) {
  const {
    images,
    imgUrl,
    setImgUrl,
  } = props;

  return (
    <div className="ct-img-picker-con">
      <div className="ct-img-picker-imgs" data-scroll>
        {images.map(img => (
          <div 
            key={img} 
            tabIndex={0}
            className="ct-img-picker-img-con"
            data-current={img === imgUrl}
            onClick={() => setImgUrl(img)}
          >
            <img src={uurl.getMediaUrl(img)} alt="Chapter Cover" />
            <div className="ct-img-picker-img-wrapper ct-d-r-center">
              {
                img === imgUrl
                &&
                <i className="material-icons">check_circle</i>
              }
            </div>
          </div>
        ))}
      </div>
      <ImagePreview imgUrl={imgUrl} />
    </div>
  );
}

ImagesTab.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  imgUrl: PropTypes.string,
  setImgUrl: PropTypes.func,
};

export default ImagesTab;
