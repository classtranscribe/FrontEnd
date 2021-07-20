import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva'
import { api, links, uurl } from 'utils';
import { logoOutlineSvg, UISlogo } from 'assets/images';
import { CTPopoverLabel } from 'layout';
import Share from './Share';
import Screenshot from './Screenshot';
import LiveTranscriptDownload from './LiveTranscriptDownload';
// import ShortcutButton from './ShortcutButton';
import './index.scss';

function ActionBar(props) {
  let {
    error,
    media,
    userReady = true,
    embedded,
    time,
    screenshotActionElement
  } = props;
  const { allowScreenshot: isScreenshotAllowed } = embedded;
  const { mediaName, id } = media || {};
  const isLiveLogo = media.isLive;

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
          {
            isLiveLogo ? (
              <img
                alt="UISLogo"
                src={UISlogo}
                className="ctp ct-logo"
              />
            ) : (
              <img
                alt="ClassTranscribe Logo"
                src={logoOutlineSvg}
                className="ctp ct-logo"
              />
            )

          }


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
            isScreenshotAllowed
            &&
            <Screenshot actionElement={screenshotActionElement} media={media} />
          }
          {!error && <Share media={media} time={time} />}
          <LiveTranscriptDownload media={media} />
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

export default connect(({ watch: { media, embedded }, playerpref }) => ({
  media, embedded
}))(ActionBar);

