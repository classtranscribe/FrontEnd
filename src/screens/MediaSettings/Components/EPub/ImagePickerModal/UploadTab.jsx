import React from 'react';
import UploadButton from './UploadButton';

function UploadTab({
  setImgUrl,
  imgUrl,
}) {

  const onUpload = image => {
    let url = URL.createObjectURL(image)
    setImgUrl(url);
  }

  return (
    <div className="msp-ee-cp-con">
      <div className="ee-cp-imgs" data-scroll>
        <div className="w-100">
          <UploadButton onUpload={onUpload} />
        </div>
      </div>
      <div className="ee-cp-cover">
        {
          imgUrl
          ?
          <img src={imgUrl} alt="Selected Cover Image" />
          :
          <div className="w-100 text-center">No image picked.</div>
        }
      </div>
    </div>
  )
}

export default UploadTab;
