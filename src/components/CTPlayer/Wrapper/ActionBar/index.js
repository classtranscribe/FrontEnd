import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import ShareButton from './ShareButton';
import ShortcutButton from './ShortcutButton';

function ActionBar(props) {
  let {
    media,
    player
  } = props;

  const { mediaName } = media || {};

  return (
    <div className="ctp action-bar">
      <div className="right">
        <div className="media-name">
          {mediaName}
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

};

export default ActionBar;

