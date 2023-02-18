import React, { useState, useEffect } from 'react';
import { Select, Form, Popup } from 'semantic-ui-react';
import { connect } from 'dva';
import MenuRadio from '../MenuRadio';
import {
  // CC_COLOR_WHITE,
  // CC_COLOR_BLACK,
  // CC_OPACITY_100,
  // CC_POSITION_BOTTOM,
  // CC_FONT_SANS_SERIF,
  // CC_SIZE_100,
  // cc_colorOptions,
  // cc_opacityOptions,
  // // cc_positionOptions,
  // cc_fontOptions,
  // cc_sizeOptions,
  screen_opacityOptions,
  getCCSelectOptions,
} from '../../../../Utils';

function DisplaySetting({ show = false, brightness = 1, dispatch }) {
  const handleBrightness = () => {
    dispatch({ type: 'playerpref/setPreference', payload: { brightness:  brightness} })
  };

  useEffect(() => {
    if (show) {
      document.getElementById('display-settings').scrollIntoView({ block: 'center' });
    }
  }, [show]);

  return (
    <form className="watch-menu-tab" id="display-settings">
      <h2 className="watch-menu-tab-title">Display</h2>
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
export default connect(({ playerpref: { brightness }, loading }) => ({
  brightness
}))(DisplaySetting);
