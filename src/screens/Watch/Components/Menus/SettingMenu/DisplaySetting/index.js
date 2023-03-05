import React, { useState, useEffect } from 'react';
import { Select, Form, Popup} from 'semantic-ui-react';
import { connect } from 'dva';
import './index.scss';
import './slider.scss';
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
  getCCSelectOptions,
} from '../../../../Utils';

function DisplaySetting({ show = false, brightness,contrast, dispatch }) {
  const handleBrightness = ({ target: { value } }) => {
    dispatch({ type: 'playerpref/setPreference', payload: { brightness:  value} })
  };
  const handleContrast = ({ target: { value } }) => {
    dispatch({ type: 'playerpref/setPreference', payload: { contrast:  value} })
  };
  const handleDefaults = () => {
    dispatch({ type: 'playerpref/setPreference', payload: { contrast:  1} })
    dispatch({ type: 'playerpref/setPreference', payload: { brightness:  1} })
  };
  

  useEffect(() => {
    if (show) {
      document.getElementById('display-settings').scrollIntoView({ block: 'center' });
    }
  }, [show]);

  return (
    <form className="watch-menu-tab" id="display-settings">
      <h2 className="watch-menu-tab-title">Display
      </h2>

      <h3 className="watch-menu-tab-subtitle">
        <input
          position="top right"
          id="brightness-slider"
          className="brightness-slider"
          label="default"
          type="button"
          value="Reset Defaults"
          onClick={handleDefaults}
        />

      </h3>
  
      <div className="w-100">
        <h3 className="watch-menu-tab-subtitle">Brightness: {Math.floor( brightness * 100)}%</h3>
        <Popup
          label="Brightness"
          inverted
          wide
          basic
          position="top center"
          offset="5, 5%"
          openOnTriggerClick={false}
          openOnTriggerFocus
          closeOnTriggerBlur
          // content={<strong>Brightness: {Math.floor(brightness * 100)}%</strong>}
          trigger={
            <input
              id="brightness-slider"
              className="brightness-slider"
              aria-label={`Brightness Slider - Current Brightness: ${Math.floor( brightness * 100)}`}
              type="range"
              min={0}
              max={2}
              step={0.05}
              value={brightness}
              onChange={handleBrightness}
            />
          }
        />
      </div>
      <div className="w-100">
        <h3 className="watch-menu-tab-subtitle">Contrast: {Math.floor( contrast * 100)}%</h3>
        <Popup
          label="Contrast"
          inverted
          wide
          basic
          position="top center"
          offset="5, 5%"
          openOnTriggerClick={false}
          openOnTriggerFocus
          closeOnTriggerBlur
          // content={<strong>Brightness: {Math.floor(brightness * 100)}%</strong>}
          trigger={
            <input
              id="brightness-slider"
              className="brightness-slider"
              aria-label={`Contrast Slider - Current Contrast: ${Math.floor( contrast * 100)}`}
              type="range"
              min={0}
              max={2}
              step={0.05}
              value={contrast}
              onChange={handleContrast}
            />
          }
        />
      </div>
    </form>
    
  );
}
export default connect(({ playerpref: { brightness, contrast }, loading }) => ({
  brightness, contrast
}))(DisplaySetting);
