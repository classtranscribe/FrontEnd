import React from 'react';
import PropTypes from 'prop-types';
import { CTInput, CTUploadButton } from 'layout';
import ImagePreview from './ImagePreview';

function UploadTab(props) {
  const { imgUrl, setImgUrl } = props;

  const onUpload = (files) => {
    if (files[0]) {
      let url = URL.createObjectURL(files[0]);
      setImgUrl(url);
    }
  };

  return (
    <div className="ct-img-picker-con">
      <div className="ct-img-picker-imgs-con">
        <div className="ct-img-picker-imgs">
          <div className="w-100">
            <div className="w-100 mb-3 pr-3">
              <CTUploadButton
                fluid
                accept="image/*"
                icon="add_a_photo"
                onFileChange={onUpload}
              >
                Browse Images
              </CTUploadButton>
            </div>

            <hr />

            <div className="w-100 pr-3">
              <CTInput
                label="Insert Image by URL"
                placeholder="Image URL"
                onChange={({ target: { value }}) => setImgUrl(value)}
              />
            </div>
          </div>
          
        </div>
      </div>
      <ImagePreview imgUrl={imgUrl} />
    </div>
  )
}

UploadTab.propTypes = {
  imgUrl: PropTypes.string,
  setImgUrl: PropTypes.func
};

export default UploadTab;
