import React from 'react';
import { connectWithRedux } from '../redux';

function ImageMagnifier({
  magnifiedImg
}) {
  return magnifiedImg ? (
    <div className="ct-epb img-magnifier">
      <img src={magnifiedImg} alt="Magnified screenshot" />
      {/* <Button round icon="close" /> */}
    </div>
  ) : null;
}

export default connectWithRedux(
  ImageMagnifier,
  ['magnifiedImg']
);