import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'dva/router';
import { api, links, uurl } from 'utils';
import { logoOutlineSvg } from 'assets/images';
import { CTPopoverLabel } from 'layout';
import Share from './Share';
import Screenshot from './Screenshot';
// import ShortcutButton from './ShortcutButton';
import './index.scss';

function ActionBar(props) {
  let {
    error,
    media,
    userReady,
    player,
    time,
    screenshotActionElement
  } = props;

  const { mediaName } = media || {};
  const { id } = useParams();

  const watchOnClassTranscribe = (e) => {
    e.preventDefault();
    let url = window.location.origin + links.watch(id, { begin: time });
    uurl.openNewTab(url);
  };

  let displayedTitle = mediaName || 'Untitled Media';
  if (api.isError(error)) {
    displayedTitle = 'Media Unavailable';
  }

  return (
    <div className="ctp action-bar">
      <div className="left">
        <div className="media-name">
          <img
            alt="ClassTranscribe Logo"
            src={logoOutlineSvg}
            className="ctp ct-logo"
          />

          <CTPopoverLabel label="Watch this video on ClassTranscribe" placement="bottom-start">
            <a href={links.watch(id)} onClick={watchOnClassTranscribe}>
              {displayedTitle}
            </a>
          </CTPopoverLabel>
        </div>
      </div>
      
      {
        userReady
        &&
        <div className="right">
          {
            player.isScreenshotAllowed
            &&
            <Screenshot player={player} actionElement={screenshotActionElement} />
          }
          {!error && <Share media={media} time={time} />}
          {/* <ShortcutButton /> */}
        </div>
      }
    </div>
  );
}

ActionBar.propTypes = {
  media: PropTypes.object,
  time: PropTypes.number
};

export default ActionBar;

