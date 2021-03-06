import React, { useState, useEffect } from 'react';
import { connect } from 'dva'
import MenuRadio from '../MenuRadio';

function ADSetting({ show = false, openAD = false, descriptions = [],
  dispatch, pauseWhileAD = false }) {
  const handleAD = (/** { target: { checked } } */) => {
    dispatch({ type: 'playerpref/toggleOpenAD' })
  };

  const handlePauseWhileAD = () => {
    dispatch({ type: 'playerpref/setPreference', payload: { pauseWhileAD: !pauseWhileAD } });
  };

  useEffect(() => {
    if (show) {
      document.getElementById('ad-settings').scrollIntoView({ block: 'center' });
    }
  }, [show]);

  const disabled = descriptions.length <= 0;

  return (
    <form className="watch-menu-tab" id="ad-settings">
      <h2 className="watch-menu-tab-title">Audio Description</h2>
      {disabled && <p>Sorry, audio description of this video is currently unavailable.</p>}
      <div className="w-100">
        <MenuRadio
          id="ad-open-radio"
          label="Open Audio Description"
          onChange={handleAD}
          checked={openAD && !disabled}
          disabled={disabled}
        />
        <MenuRadio
          id="ad-pause-radio"
          label="Pause video when Audio Description starts"
          onChange={handlePauseWhileAD}
          checked={pauseWhileAD && !disabled}
          disabled={disabled}
          description="Turn on to automatically pause video when there is a audio description."
        />
      </div>
    </form>
  );
}

export default connect(({ watch: { descriptions },
  playerpref: { openAD, pauseWhileAD }, loading }) => ({
    openAD, descriptions, pauseWhileAD
  }))(ADSetting);
