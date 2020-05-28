import React from 'react';
import { Link } from 'react-router-dom';
import { Popup } from 'semantic-ui-react';
import { util } from 'utils';
import { connectWithRedux } from '../../controllers';
import './index.scss';

function MSPHeaderTabTitleWithRedux(props) {
  let { media, playlist } = props;
  
  const { mediaName } = media;
  const { offeringId } = playlist;

  return (
    <Popup
      inverted
      openOnTriggerFocus
      closeOnTriggerBlur
      content={
        <div>
          <strong>{mediaName}</strong>
        </div>
      }
      trigger={
        <Link
          className="msp-me-name"
          to={
            offeringId && playlist.id
              ? util.links.instOffering(offeringId, playlist.id, media.id)
              : util.links.instructor()
          }
        >
          <i aria-hidden="true" className="material-icons">
            chevron_left
          </i>
          <span>{mediaName}</span>
        </Link>
      }
    />
  )
}

export const MSPHeaderTabTitle = connectWithRedux(
  MSPHeaderTabTitleWithRedux, 
  ['media', 'playlist']
);
