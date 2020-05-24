import React from 'react';
import { connectWithRedux } from '../../../controllers/epub';

function ImageMagnifier({
  magnifiedImg
}) {
  return magnifiedImg ? (
    <div className="ee-sch-magnifier">
      <img src={magnifiedImg} alt="Magnified screenshot" />
      {/* <Button round icon="close" /> */}
    </div>
  ) : null;
}

export default connectWithRedux(
  ImageMagnifier,
  ['magnifiedImg']
);

