import React, { useEffect, useState } from 'react';
import { VideoCard } from 'components';
import { api, links } from 'utils';
import {
  connectWithRedux,
  videoControl,
  CTP_LOADING,
  CTP_UP_NEXT,
  CTP_ENDED,
} from '../../../Utils';
import './index.css';

function UpNextWithRedux({ media, ctpPriEvent = CTP_LOADING }) {
  const [show, setShow] = useState(false);

  const onClose = () => {
    setShow(false);
  };

  const upNext = videoControl.findUpNextMedia({ currMediaId: media.id });

  useEffect(() => {
    const displayUpnext =
      (ctpPriEvent === CTP_UP_NEXT || ctpPriEvent === CTP_ENDED) && upNext && Boolean(upNext.id);

    if (displayUpnext) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [ctpPriEvent]);

  return show ? (
    <div className="watch-prompt watch-upn" data-position="bottom left">
      <div className="prompt-upnext" id="watch-upnext">
        <div className="wml-header watch-un-header">
          <h3>
            <i className="material-icons" aria-hidden="true">
              skip_next
            </i>
            Next Video
          </h3>
          <button className="plain-btn wml-close-btn" aria-label="Close" onClick={onClose}>
            <span tabIndex="-1">
              <i className="material-icons">close</i>
            </span>
          </button>
        </div>

        <Video upNext={upNext} />
      </div>
    </div>
  ) : null;
}

function Video({ upNext = null }) {
  const media = api.parseMedia(upNext);
  const { id, mediaName } = media;

  return (
    <div role="listitem" className="watch-video-item search-result-listitem search-result-videos">
      <VideoCard
        row
        dark
        id={id}
        name={mediaName}
        posterSize="100px"
        fittedNameSize={-1}
        link={links.watch(id)}
      />
    </div>
  );
}

export const UpNext = connectWithRedux(UpNextWithRedux, ['media', 'ctpPriEvent']);
