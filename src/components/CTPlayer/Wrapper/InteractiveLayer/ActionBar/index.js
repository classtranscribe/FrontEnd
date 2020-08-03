import React from 'react';
import PropTypes from 'prop-types';
import { links, uurl } from 'utils';
import { logoOutlineSvg } from 'assets/images';
import { CTPopoverLabel } from 'layout';
import Share from './Share';
// import ShortcutButton from './ShortcutButton';
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

          <CTPopoverLabel label="Watch this video on ClassTranscribe" placement="bottom-start">
            <a href={links.watch(id)} onClick={watchOnClassTranscribe}>
              {mediaName}
            </a>
          </CTPopoverLabel>
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
  time: PropTypes.number
};

export default ActionBar;

