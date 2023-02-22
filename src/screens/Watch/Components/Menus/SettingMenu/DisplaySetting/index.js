import React, { useState, useEffect } from 'react';
import { Select, Form, Popup, Button } from 'semantic-ui-react';
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
class Display1 extends React.Component {
  render() {
    return (
      <div className="box-field">Bruh
        <h3>News</h3>
      </div>
    );
  }
}

class Display2 extends React.Component {
  render() {
    return (
      <div className="box-field">
        <h3>News</h3>
      </div>
    );
  }
}
function DisplaySetting({ show = false, brightness, dispatch }) {
  const handleBrightness = ({ target: { value } }) => {
    dispatch({ type: 'playerpref/setPreference', payload: { brightness:  value} })
    // dispatch({type: 'watch/media_brightness', payload: value})
  };
  const handleDefaultBrightness =()=> {
    dispatch({ type: 'playerpref/setPreference', payload: { brightness:  1} })
    // dispatch({type: 'watch/media_brightness', payload: value})
  };
  

  useEffect(() => {
    if (show) {
      document.getElementById('display-settings').scrollIntoView({ block: 'center' });
    }
  }, [show]);

  //const ButtonExampleButton = () => <Button>Click Here</Button>



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
              value={"Reset Defaults"}
              onClick={handleDefaultBrightness}
            
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
    </form>
    
  );
}
//export default ButtonExampleButton;

export default connect(({ playerpref: { brightness }, loading }) => ({
  brightness
}))(DisplaySetting);
