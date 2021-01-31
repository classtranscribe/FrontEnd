import React, { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { connect } from 'dva'
import {
  LINE_VIEW,
  TRANSCRIPT_VIEW,
  HIDE_TRANS,
} from '../../../../Utils';

import MenuRadio from '../MenuRadio';

function TranscriptionSetting({ show = false, transView = LINE_VIEW, dispatch,
  autoScroll, pauseWhileEditing }) {
  const openTranscript = () => {
    const view = transView;
    dispatch({ type: 'playerpref/setTransView', payload: { view: view === HIDE_TRANS ? TRANSCRIPT_VIEW : HIDE_TRANS } });
  };

  const openAutoScroll = () => {
    // console.error()
    dispatch({ type: 'playerpref/setPreference', payload: { autoScroll: !autoScroll } });
  };

  const handlePauseWhileEditing = () => {
    dispatch({ type: 'playerpref/setPreference', payload: { pauseWhileEditing: !pauseWhileEditing } });
  };

  const handleTransView = () => {
    dispatch({ type: 'playerpref/setTransView', payload: { view: transView === LINE_VIEW ? TRANSCRIPT_VIEW : LINE_VIEW } });
  };

  useEffect(() => {
    if (show) {
      document.getElementById('trans-settings').scrollIntoView({ block: 'center' });
    }
  }, [show]);

  return (
    <form className="watch-menu-tab" id="trans-settings">
      <h2 className="watch-menu-tab-title">Transcriptions</h2>
      <div className="w-100">
        <MenuRadio
          id="trans-open-radio"
          checked={transView !== HIDE_TRANS}
          label="Open Transcription"
          onChange={openTranscript}
        />
        <MenuRadio
          id="trans-auto-scroll-radio"
          label="Automatically scroll"
          onChange={openAutoScroll}
          checked={autoScroll}
        />
        <MenuRadio
          id="edit-pause-radio"
          label="Pause video while editing captions"
          onChange={handlePauseWhileEditing}
          checked={pauseWhileEditing}
          description="Turn on to automatically pause video if you start to edit captions."
        />
      </div>
      {transView !== HIDE_TRANS && !isMobile && (
        <>
          <h3 className="watch-menu-tab-subtitle">Transcription Views</h3>
          <div className="w-100">
            <MenuRadio
              id="transcript-view-radio"
              label="Transcript View"
              type="radio"
              onChange={handleTransView}
              checked={transView === TRANSCRIPT_VIEW}
              description="Default Transcription View."
            />
            <MenuRadio
              id="line-view-radio"
              label="Caption Line View"
              type="radio"
              onChange={handleTransView}
              checked={transView === LINE_VIEW}
              description="Only Caption Line View provides editable transcriptions."
            />
          </div>
        </>
      )}
    </form>
  );
}

export default connect(({ playerpref: { transView, autoScroll, pauseWhileEditing }, loading }) => ({
  transView, autoScroll, pauseWhileEditing
}))(TranscriptionSetting)
