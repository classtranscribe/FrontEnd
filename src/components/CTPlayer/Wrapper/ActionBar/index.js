import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import { links } from 'utils/links';
import { logoOutlineSvg } from 'assets/images';
import { CTPlayerController } from '../../controllers';
import ShareButton from './ShareButton';
import ShortcutButton from './ShortcutButton';
import './index.scss';

function ActionBar(props) {
  let {
    media,
    player
  } = props;

  const { mediaName, id } = media || {};

  const watchOnClassTranscribe = (e) => {
    e.preventDefault();
    window.location = links.watch(id, { begin: player.time });
  };

  return (
    <div className="ctp action-bar">
      <div className="right">
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
      <div className="left">
        <ShareButton />
        <ShortcutButton />
      </div>
    </div>
  );
}

ActionBar.propTypes = {
  media: PropTypes.object,
  player: PropTypes.instanceOf(CTPlayerController)
};

export default ActionBar;

