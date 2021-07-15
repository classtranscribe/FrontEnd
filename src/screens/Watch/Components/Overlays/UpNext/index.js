import React, { useEffect, useState } from 'react';
import { MediaCard } from 'components';
import setup from '../../../model/setup'
import {
  connectWithRedux,
  CTP_LOADING,
  CTP_UP_NEXT,
  CTP_ENDED,
} from '../../../Utils';
import './index.scss';

function UpNextWithRedux({ media, ctpPriEvent = CTP_LOADING, playlist }) {
  const [show, setShow] = useState(false);

  const onClose = () => {
    setShow(false);
  };

  const { next: upNext } = setup.findNeighbors(media.id, playlist);

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

        <MediaCard
          row
          dark
          {...MediaCard.parse(upNext)}
          label="Up Next"
          posterSize="medium"
        />
      </div>
    </div>
  ) : null;
}

export const UpNext = connectWithRedux(
  UpNextWithRedux,
  ['media', 'ctpPriEvent']
);
