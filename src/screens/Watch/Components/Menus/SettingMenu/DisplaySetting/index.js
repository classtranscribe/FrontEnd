import React, { useEffect } from 'react';
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
  getCCSelectOptions,PS_MODE,screen_zoomOptions,
  screenModes,
} from '../../../../Utils';

function DisplaySetting({ show = false, rotateColor = '0', invert = 0, brightness, contrast, scale, dispatch, mode, isSwitched /* magnifyX, magnifyY */}) {
  const handleBrightness = ({ target: { value } }) => {
    dispatch({ type: 'playerpref/setPreference', payload: { brightness:  value} })
  };
  const handleContrast = ({ target: { value } }) => {
    dispatch({ type: 'playerpref/setPreference', payload: { contrast:  value} })
  };
  const handleMap0 = () => {
    dispatch({ type: 'playerpref/setPreference', payload: { rotateColor:  '0'} })
    dispatch({ type: 'playerpref/setPreference', payload: { invert:  0} })
  };
  const handleMapInverted = () => {
    dispatch({ type: 'playerpref/setPreference', payload: { invert:  1} })
    dispatch({ type: 'playerpref/setPreference', payload: { rotateColor:  '1deg'} })
  };

  const handleMap1 = () => {
    dispatch({ type: 'playerpref/setPreference', payload: { rotateColor:  '120deg'} })
    dispatch({ type: 'playerpref/setPreference', payload: { invert:  0} })
  };
  const handleMap2 = () => {
    dispatch({ type: 'playerpref/setPreference', payload: { rotateColor:  '240deg'} })
    dispatch({ type: 'playerpref/setPreference', payload: { invert:  0} })
  };
  const handleDefaults = () => {
    dispatch({ type: 'playerpref/setPreference', payload: { contrast:  1} })
    dispatch({ type: 'playerpref/setPreference', payload: { brightness:  1} })
    dispatch({ type: 'playerpref/setPreference', payload: { rotateColor:  '0'} })
    dispatch({ type: 'playerpref/setPreference', payload: { invert:  0} })
    dispatch({ type: 'playerpref/setPreference', payload: { scale: 1 } })
    dispatch({ type: 'playerpref/setPreference', payload: { magnifyX: 0 } })
    dispatch({ type: 'playerpref/setPreference', payload: { magnifyY: 0 } })
    dispatch({ type: 'watch/setWatchMode', payload: { mode: PS_MODE } });
    if (isSwitched) {
      dispatch({ type: 'watch/switchVideo' });
    }
  };
  const handleSwitch = (e) => {
    e.preventDefault();
    dispatch({ type: 'watch/switchVideo' });
  };
  const handleChooseMode = (mode_) => (e) => {
    e.preventDefault();
    dispatch({ type: 'watch/setWatchMode', payload: { mode: mode_ } });
  };

  useEffect(() => {
    if (show) {
      document.getElementById('display-settings').scrollIntoView({ block: 'center' });
    }
  }, [show]);


  return (
    <form className="watch-menu-tab" id="display-settings" aria-label="Display Settings">
      <h2 className="watch-menu-tab-title">Display
      </h2>

      <h3 className="watch-menu-tab-subtitle">
        <input
          // position="top right"
          id="brightness-slider"
          className="brightness-slider"
          label="default"
          type="button"
          value="Reset Defaults"
          onClick={handleDefaults}
        />

      </h3>

      <div className="w-100">
        <h3 className="watch-menu-tab-subtitle">Screen Mode:</h3>
        {screenModes.map((screenMode) => (
          <button
            key={screenMode.type}
            mode={screenMode.type}
            className="plain-btn watch-icon-listitem"
            aria-label={screenMode.name}
            onClick={handleChooseMode(screenMode.type)}
            role="menuitem"
          >
            <span tabIndex="-1" className='screen-mode-span'>
              <i className="material-icons watch-icon-icon">{screenMode.icon}</i>
              <div className="watch-icon-name">{screenMode.name}</div>
              <div className="watch-icon-listitem-checkmark">
                {mode === screenMode.type && <i className="material-icons">check</i>}
              </div>
            </span>
          </button>
        ))}
        <button
          key="switch-screens"
          mode="switch-screens"
          className="plain-btn watch-icon-listitem"
          aria-label="switch-screens"
          onClick={handleSwitch}
          role="menuitem"
        >
          <span tabIndex="-1" className='screen-mode-span'>
            <i className="material-icons watch-icon-icon">compare_arrows</i>
            <div className="watch-icon-name"> Switch Screens </div>
            <div className="watch-icon-listitem-checkmark">
              {isSwitched && <i className="material-icons">check</i>}
            </div>
          </span>
        </button>
      </div>
  
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
      <div className="w-100">
        <h3 className="watch-menu-tab-subtitle">Color Maps:</h3>
        <MenuRadio
          id="color-maps-normal"
          checked={rotateColor === '0'}
          label="Normal"
          value={0}
          onChange={handleMap0}
        />
        <MenuRadio
          id="color-maps-inverted"
          label="Inverted"
          onChange={handleMapInverted}
          checked={invert === 1}
        />
        <MenuRadio
          id="color-maps1"
          label="Color Map 1"
          value={120}
          onChange={handleMap1}
          checked={rotateColor === '120deg'}
        />
        <MenuRadio
          id="color-maps2"
          label="Color Map 2"
          value={240}
          onChange={handleMap2}
          checked={rotateColor === '240deg'}
        />

      </div>
      <div className="w-100">
        <h3 className="watch-menu-tab-subtitle">Screen Zoom:</h3>
        <h3 className="watch-menu-tab-subtitle">Move around using Shift-WASD:</h3>

        <Form.Field
          fluid
          control={Select}
          label="Zoom"
          aria-label="Zoom"
          options={getCCSelectOptions(screen_zoomOptions, (item) => `${item * 100}%`)}
          value={scale}
          onChange={(event, { value }) => dispatch({ type: 'playerpref/setPreference', payload: { scale: value } })}
        />
      </div>
    </form>
    
  );
}
export default connect(({ playerpref: { brightness, contrast, rotateColor, invert, scale, magnifyX, magnifyY }, watch: { mode, isSwitched } }) => ({
  brightness, contrast, rotateColor, invert, scale, mode, isSwitched, magnifyX, magnifyY
}))(DisplaySetting);


