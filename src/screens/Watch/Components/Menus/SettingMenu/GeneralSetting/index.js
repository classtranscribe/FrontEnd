import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import MenuRadio from '../MenuRadio';

function GeneralSetting({ show = false, autoPlay = true, dispatch }) {
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
    </form>
  );
}
export default connect(({ playerpref: { autoPlay }, loading }) => ({
  autoPlay
}))(GeneralSetting);
