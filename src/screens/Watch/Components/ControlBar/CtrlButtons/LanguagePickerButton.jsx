import React from 'react';
import { connect } from 'dva';
import WatchCtrlButton from '../../WatchCtrlButton';
import { langMap, MENU_HIDE, MENU_LANGUAGE } from '../../../Utils';

export function LanguagePickerButtonWithRedux({ menu = MENU_HIDE, currTrans = {}, dispatch }) {
  const handleMenuTrigger = () => {
    if (menu !== MENU_LANGUAGE) {
      dispatch({type: 'watch/menu_open', payload: { type: MENU_LANGUAGE } });
    } else {
      dispatch({type: 'watch/menu_close'});
    }
  };

  return (
    <WatchCtrlButton
      onClick={handleMenuTrigger}
      active={menu === MENU_LANGUAGE}
      label={<>Current Language: {langMap[currTrans.language]} (SHIFT+L)</>}
      id={MENU_LANGUAGE}
      ariaTags={{
        'aria-label': `Language Menu`,
        // 'aria-keyshortcuts': 'Shift+L',
        'aria-controls': 'watch-language-menu',
        'aria-expanded': menu === MENU_LANGUAGE ? 'false' : 'true',
      }}
    >
      <span aria-hidden="true" className="watch-btn-content" tabIndex="-1">
        <i className="material-icons">subtitles</i>
      </span>
    </WatchCtrlButton>
  );
}

export const LanguagePickerButton = connect(({ watch: { menu, currTrans }, loading }) => ({
  menu, currTrans
}))(LanguagePickerButtonWithRedux);
