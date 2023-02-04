import React, { useState, useEffect } from 'react';
import { Select, Form } from 'semantic-ui-react';
import { connect } from 'dva';
import MenuRadio from '../MenuRadio';
import {
  screen_opacityOptions,
  getCCSelectOptions,
} from '../../../../Utils';


function GeneralSetting({ show = false, autoPlay = true, brightness=1, dispatch }) {
  const handleAutoPlay = () => {
    dispatch({ type: 'playerpref/setPreference', payload: { autoPlay: !autoPlay } })
  };

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

      <div className="w-100">
      <Form.Field
        fluid
        control={Select}
        label="Brightness"
        aria-label="Brightness"
        options={getCCSelectOptions(screen_opacityOptions)}
        value={brightness}
        onChange={(event, { value }) => dispatch({ type: 'playerpref/setPreference', payload: { brightness: value } })}
        />
      </div>

    </form>
  
    
  );
}
export default connect(({ playerpref: { autoPlay, brightness }, loading }) => ({
  autoPlay, brightness
}))(GeneralSetting);
