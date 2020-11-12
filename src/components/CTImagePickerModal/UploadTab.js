import React from 'react';
import PropTypes from 'prop-types';
import { CTInput, CTUploadButton, CTFormHelp } from 'layout';
import { _createImage } from 'components/CTPlayer';
import { prompt } from 'utils';
import ImagePreview from './ImagePreview';

export async function _uploadImageFile(imgFile, sourceType, sourceId) {
  prompt.addOne({ text: 'Uploading the image...', timeout: 2000 });
  const imgData = await _createImage(imgFile, sourceType, sourceId);
  return imgData;
};

function UploadTab(props) {
  const { imgUrl, setImgUrl, sourceType, sourceId } = props;

  const onUpload = async (files) => {
    if (files[0]) {
      const imgData = await _uploadImageFile(files[0], sourceType, sourceId);
      if (!imgData) {
        return;
      }

      setImgUrl(imgData.imageFile.path);
    }
  };

  return (
    <div className="ct-img-picker-con">
      <div className="ct-img-picker-imgs-con">
        <div className="ct-img-picker-imgs">
          <div className="w-100 pr-3">
            <CTFormHelp title="INSTRUCTION">
              You can upload an image file (.png, .jpeg, ...). 
              Click the &quot;BROWSE IMAGES&quot; button below to browse files.
            </CTFormHelp>
            <div className="w-100 mb-3">
              <CTUploadButton
                fluid
                accept="image/*"
                icon="add_a_photo"
                onFileChange={onUpload}
              >
                Browse Images
              </CTUploadButton>
            </div>

            {/* <hr />

            <div className="w-100 pr-3">
              <CTInput
                label="Insert Image by URL"
                placeholder="Image URL"
                onChange={({ target: { value }}) => setImgUrl(value)}
              />
            </div> */}
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
