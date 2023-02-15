import React, { useState, useEffect } from 'react';
import { Select, Form } from 'semantic-ui-react';
import { connect } from 'dva';
import MenuRadio from '../MenuRadio';
import {
  screen_opacityOptions,
  getCCSelectOptions,
  getVideoStyle,
} from '../../../../Utils';


function GeneralSetting({ show = false, autoPlay = true, brightness=1, dispatch }) {
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
  const { videoStyle } = getVideoStyle({brightness});

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
export default connect(({ playerpref: { autoPlay, brightness }, loading }) => ({
  autoPlay, brightness
}))(GeneralSetting);
