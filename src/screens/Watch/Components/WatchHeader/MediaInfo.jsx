import React, { useEffect } from 'react';
import { Link } from 'dva/router';
import { Popup } from 'semantic-ui-react';
import { links } from 'utils/links';
import { connectWithRedux } from '../../Utils';

function MediaInfo({ media = {}, playlist = {}, offering = {} }) {
  const { mediaName } = media;
  const { fullNumber } = offering;

  useEffect(() => {
    if (mediaName && fullNumber) {
      links.title(`${mediaName} | ${fullNumber}`);
    }
  }, [media, offering]);

  return (
    <Popup
      inverted
      basic
      wide
      hoverable
      position="bottom left"
      mouseEnterDelay={700}
      content="Back to the course page"
      trigger={
        <Link
          className="watch-media-info"
          to={{pathname: links.course(playlist.offeringId, playlist.id, media.id), search: ''}}
        >
          <span className="watch-header-course-num">
            {fullNumber}
            <span>{playlist.name}</span>
          </span>
          <span className="watch-header-media-name">{mediaName}</span>
        </Link>
      }
    />
  );
}

export default connectWithRedux(MediaInfo, ['media', 'playlist', 'offering']);
