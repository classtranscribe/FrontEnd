import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import { links, uurl } from 'utils';
import { logoOutlineSvg } from 'assets/images';
import { CTPlayerController } from '../../../controllers';

import Share from './Share';
import ShortcutButton from './ShortcutButton';
import './index.scss';

function ActionBar(props) {
  let {
    media,
    time
  } = props;

  const { mediaName, id } = media || {};

  const watchOnClassTranscribe = (e) => {
    e.preventDefault();
    let url = window.location.origin + links.watch(id, { begin: time });
    uurl.openNewTab(url);
  };

  return (
    <div className="ctp action-bar">
      <div className="left">
        <div className="media-name">
          <img
            alt="ClassTranscribe Logo"
            src={logoOutlineSvg}
            className="ctp ct-logo"
          />

          <Tooltip title="Watch this video on ClassTranscribe" placement="bottom">
            <a href={links.watch(id)} onClick={watchOnClassTranscribe}>
              {mediaName}
            </a>
          </Tooltip>
        </div>
      </div>
      
      <div className="right">
        <Share media={media} time={time} />
        {/* <ShortcutButton /> */}
      </div>
    </div>
  );
}

ActionBar.propTypes = {
  media: PropTypes.object,
  player: PropTypes.instanceOf(CTPlayerController)
};

export default ActionBar;

