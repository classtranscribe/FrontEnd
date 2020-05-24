import React from 'react';
import { epub } from 'screens/MediaSettings/controllers/epub';

function ScreenshotTab({
  screenshots,
  setImgUrl,
  imgUrl,
}) {
  return (
    <div className="msp-ee-cp-con">
      <div className="ee-cp-imgs" data-scroll>
        {screenshots.map(img => (
          <div 
            key={img} 
            tabIndex={0}
            className="ee-cp-img-con"
            data-current={img === imgUrl}
            onClick={() => setImgUrl(img)}
          >
            <img src={epub.getImageUrl(img)} alt="Chapter Cover" />
            <div className="ee-cp-img-wrapper ct-d-r-center">
              {
                img === imgUrl
                &&
                <i className="material-icons">check_circle</i>
              }
            </div>
          </div>
        ))}
      </div>
      <div className="ee-cp-cover">
        {
          imgUrl
          ?
            <img src={epub.getImageUrl(imgUrl)} alt="Selected Cover" />
          :
            <div className="w-100 text-center">No image picked.</div>
        }
      </div>
    </div>
  );
}

export default ScreenshotTab;
