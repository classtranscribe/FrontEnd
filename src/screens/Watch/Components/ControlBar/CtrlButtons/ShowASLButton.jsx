import React from 'react';
import { connect } from 'dva'
import WatchCtrlButton from '../../WatchCtrlButton';

export function ShowASLButtonWithRedux({ hasASL = true, aslCorner = 0, dispatch }) {
  const handleASLTrigger = () => {
    dispatch({ type: 'playerpref/toggleASLPosition' })
  };
  // eslint-disable-next-line no-console 
 const corner = `ASL ${ ['Off', 'Left' , 'Right'][aslCorner]}`;
  return hasASL ? (
    <WatchCtrlButton
      onClick={handleASLTrigger}
      label={corner}
      id="asl-screen--btn"
      colored={aslCorner>0}
      ariaTags={{
        'aria-label': {corner},
        // 'aria-keyshortcuts': 'c',
        'aria-controls': 'watch-ad-container',
        'aria-expanded': {corner}
      }}
    >
      <span aria-hidden="true" className="watch-btn-content" tabIndex="-1">
        <i className="fas fa-american-sign-language-interpreting" aria-hidden="true" />
      </span>
    </WatchCtrlButton>
  ) : null;
}

export const ShowASLButton = connect(({ watch: { media: { hasASL }}, playerpref: { aslCorner }, loading }) => ({
   hasASL, aslCorner
}))(ShowASLButtonWithRedux);