import React from 'react';
import { connect } from 'dva';
import WatchCtrlButton from '../../WatchCtrlButton';
import { MENU_HIDE, MENU_TRANSCRIPTION } from '../../../Utils';

export function TranscriptionPickerButtonWithRedux({ menu = MENU_HIDE, currentTranscriptionMulti = {}, dispatch }) {
  const handleMenuTrigger = () => {
    if (menu !== MENU_TRANSCRIPTION) {
      dispatch({type: 'watch/menu_open', payload: { type: MENU_TRANSCRIPTION } });
    } else {
      dispatch({type: 'watch/menu_close'});
    }
  };

  return (
    <WatchCtrlButton
      onClick={handleMenuTrigger}
      active={menu === MENU_TRANSCRIPTION}
      label={<>{currentTranscriptionMulti.buttonLabel || 'Transcriptions (Shift-T)'}</>}
      id={MENU_TRANSCRIPTION}
      ariaTags={{
        'aria-label': `Transcription Menu`,
        // 'aria-keyshortcuts': 'Shift+T',
        'aria-controls': 'watch-language-menu',
        'aria-expanded': menu === MENU_TRANSCRIPTION ? 'false' : 'true',
      }}
    >
      <span aria-hidden="true" className="watch-btn-content" tabIndex="-1">
        <i className="material-icons">subtitles</i>
      </span>
    </WatchCtrlButton>
  );
}

export const TranscriptionPickerButton = connect(({ watch: { menu, currentTranscriptionMulti }, loading }) => ({
  menu, currentTranscriptionMulti
}))(TranscriptionPickerButtonWithRedux);
