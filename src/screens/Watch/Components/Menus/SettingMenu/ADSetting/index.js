import React, { /* useState, */useEffect } from 'react';
import { /* Select, Form, Grid, */Popup } from 'semantic-ui-react';
import { connect } from 'dva'
// import { Adb } from '@material-ui/icons';
import MenuRadio from '../MenuRadio';

import './slider.scss';

function ADSetting({ show = false, openAD = false, descriptions = [],
  dispatch, pauseWhileAD = false, ADVolume, ADSpeed}) {
  const handleAD = (/** { target: { checked } } */) => {
    dispatch({ type: 'playerpref/toggleOpenAD' })
  };

  const handlePauseWhileAD = () => {
    dispatch({ type: 'playerpref/setPreference', payload: { pauseWhileAD: !pauseWhileAD } });
  };

  const handleADVolume = ({ target: { value } }) => {
    dispatch({ type: 'playerpref/setPreference', payload: { ADVolume: value } });
  };

  const handleADSpeed = ({ target: { value } }) => {
    dispatch({ type: 'playerpref/setPreference', payload: { ADSpeed: value } });
  };

  useEffect(() => {
    if (show) {
      document.getElementById('ad-settings').scrollIntoView({ block: 'center' });
    }
  }, [show]);

  const disabled = descriptions.length <= 0;

  return (
    <form className="watch-menu-tab" id="ad-settings" aria-label='Audio Description Settings'>
      <h2 className="watch-menu-tab-title">Audio Description</h2>
      {disabled && <p>Sorry, audio description of this video is currently unavailable.</p>}
      <div className="w-100">
        <MenuRadio
          id="ad-open-radio"
          label="Enable Audio Description"
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
        <div className="w-100">
          <h3 className="watch-menu-tab-subtitle">AD Volume: {Math.floor( ADVolume * 100)}%</h3>
          <Popup
            label="AD Volume"
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
                id="ad-volume-slider"
                className="brightness-slider"
                aria-label={`Audio Description Volume Slider - Current Volume: ${Math.floor( ADVolume * 100)}`}
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={ADVolume}
                onChange={handleADVolume}
              />
            }
          />
        </div>
        <div className="w-100">
          <h3 className="watch-menu-tab-subtitle">AD Speed: {Math.floor( ADSpeed * 100)}%</h3>
          <Popup
            label="AD Speed"
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
                id="ad-speed-slider"
                className="brightness-slider"
                aria-label={`Audio Description Speed Slider - Current Speed: ${Math.floor( ADVolume * 100)}`}
                type="range"
                min={0}
                max={3}
                step={0.05}
                value={ADSpeed}
                defaultValue={1.2}
                onChange={handleADSpeed}
              />
            }
          />
        </div>
      </div>
    </form>
  );
}

export default connect(({ watch: { descriptions },
  playerpref: { openAD, pauseWhileAD, ADVolume, ADSpeed } }) => ({
    openAD, descriptions, pauseWhileAD, ADVolume, ADSpeed
  }))(ADSetting);
