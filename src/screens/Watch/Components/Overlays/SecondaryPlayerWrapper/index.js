import React from 'react';
import {
  connectWithRedux,
  promptControl,
  NORMAL_MODE,
  CTP_LOADING,
  CTP_ERROR,
} from '../../../Utils';
import './index.scss';

function SecondaryPlayerWrapperWithRedux({
  mode = NORMAL_MODE,
  ctpSecEvent = CTP_LOADING,
  isPrimary = false,
  dispatch
}) {
  const onSwitch = () => dispatch({ type: 'watch/switchVideo' });
  const onHide = () => {
    dispatch({ type: 'watch/setWatchMode', payload: { mode: NORMAL_MODE } });
    promptControl.hideSecondaryScreen();
  };

  if (isPrimary) return null;

  return ctpSecEvent === CTP_ERROR ? (
    <div className="watch-secondary-wrapper" data-blur="true">
      Media Unavailable
    </div>
  ) : ctpSecEvent === CTP_LOADING ? (
    <div className="watch-secondary-wrapper" data-blur="true">
      <div>
        <div className="sk-chase" color="green">
          <div className="sk-chase-dot" />
          <div className="sk-chase-dot" />
          <div className="sk-chase-dot" />
          <div className="sk-chase-dot" />
          <div className="sk-chase-dot" />
          <div className="sk-chase-dot" />
        </div>
      </div>
    </div>
  ) : (
    <div className="watch-secondary-wrapper" mode={mode}>
      <div className="watch-secondary-wrapper-left">
        <button
          className="watch-secondary-wrapper-button plain-btn ripple-btn"
          content="switch"
          aria-label="Switch Screen"
          onClick={onSwitch}
        >
          <p className="text-center">
            <i className="material-icons">compare_arrows</i>
            <br />
            <strong>Switch</strong>
          </p>
        </button>
      </div>
      <div className="watch-secondary-wrapper-right">
        <button
          className="watch-secondary-wrapper-button plain-btn ripple-btn"
          content="close"
          aria-label="Hide Screen"
          onClick={onHide}
        >
          <p className="text-center">
            <i className="material-icons">close</i>
            <br />
            <strong>Hide</strong>
          </p>
        </button>
      </div>
    </div>
      );
}

export const SecondaryPlayerWrapper = connectWithRedux(SecondaryPlayerWrapperWithRedux, [
  'mode',
  'ctpSecEvent',
]);
