import React from 'react';
import { Link } from 'dva/router';
import { CTPopoverLabel } from 'layout';
import { links } from 'utils/links';
import './index.scss';

function MSPHeaderTabTitleWithRedux(props) {
  let { media, playlist } = props.mediasetting;
  
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

export const MSPHeaderTabTitle = MSPHeaderTabTitleWithRedux;
