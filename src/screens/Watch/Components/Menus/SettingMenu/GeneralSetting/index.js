import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import MenuRadio from '../MenuRadio';

function GeneralSetting({ show = false, brightness = 100, autoPlay = true, dispatch }) {
  const handleAutoPlay = () => {
    dispatch({ type: 'playerpref/setPreference', payload: { autoPlay: !autoPlay } })
  };
  // const handleBrightness = () => {
  //   dispatch({ type: 'playerpref/setPreference', payload: { brightness:  autoPlay} })
  // };

  useEffect(() => {
    if (show) {
      document.getElementById('general-settings').scrollIntoView({ block: 'center' });
    }
  }, [show]);

  return (
    <form className="watch-menu-tab" id="general-settings">
      <h2 className="watch-menu-tab-title">General</h2>
      <div className="w-100">
        <MenuRadio
          id="auto-play-checkbox"
          label="Auto Play"
          onChange={handleAutoPlay}
          checked={autoPlay}
        />
      </div>
      {/* <h2 className="watch-menu-tab-title">Display</h2>
      <div className="w-100">
      <MenuRadio
          id="brightness-input"
          label="Brightness"
          onChange={handleBrightness}
          checked={brightness}
        />
      </div> */}
    </form>
    
  );
}
export default connect(({ playerpref: { autoPlay }, loading }) => ({
  autoPlay
}))(GeneralSetting);
