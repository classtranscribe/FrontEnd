import React from 'react';
import { Link } from 'react-router-dom';
import { CTPopoverLabel } from 'layout';
import { links } from 'utils/links';
import { connectWithRedux } from '../../controllers';
import './index.scss';

function MSPHeaderTabTitleWithRedux(props) {
  let { media, playlist } = props;
  
  const { mediaName } = media;
  // const { offeringId } = playlist;

  return (
    <CTPopoverLabel label={<strong>{mediaName}</strong>}>
      <Link
        className="msp-me-name-con"
        to={links.playlist(playlist.id, media.id)}
      >
        <i aria-hidden="true" className="material-icons">
          chevron_left
        </i>
        <span className="name">{mediaName}</span>
      </Link>
    </CTPopoverLabel>
  )
}

export const MSPHeaderTabTitle = connectWithRedux(
  MSPHeaderTabTitleWithRedux, 
  ['media', 'playlist']
);
