import React from 'react';

function ImageMagnifier({
  magnifiedImg
}) {
  return Boolean(magnifiedImg) ? (
    <div className="ee-ep-magnify">
      <img src={magnifiedImg} alt="Magnified screenshot" />
      {/* <Button round icon="close" /> */}
    </div>
  ) : null;
}

export default ImageMagnifier;

