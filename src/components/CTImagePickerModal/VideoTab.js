import React from 'react';
import { CTFragment } from 'layout';
import CTPlayer from 'components/CTPlayer';

function VideoTab({
  media,
  mediaId,
  imgUrl,
  setImgUrl 
}) {
  return (
    <div className="ct-img-picker-con">
      <CTFragment>
        <CTPlayer
          fill
          media={media}
          mediaId={mediaId}
          allowScreenshot
        />
      </CTFragment>
    </div>
  );
}

export default VideoTab;
