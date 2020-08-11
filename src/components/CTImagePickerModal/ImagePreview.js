import React from 'react';
import { uurl } from 'utils/use-url';
import CTImageMagnifer from '../CTImageMagnifer';

function ImagePreview({ imgUrl }) {
  return (
    <div className="ct-img-picker-cover">
      {
        imgUrl
        ?
          <CTImageMagnifer src={uurl.getMediaUrl(imgUrl)} alt="Selected Cover" />
        :
          <div className="w-100 text-center">No image picked.</div>
      }
    </div>
  );
}

export default ImagePreview;
