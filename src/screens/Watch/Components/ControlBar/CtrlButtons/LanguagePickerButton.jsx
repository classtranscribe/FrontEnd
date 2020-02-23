import React from 'react'
import _ from 'lodash'
import WatchCtrlButton from '../../WatchCtrlButton'
import { 
  connectWithRedux,
  MENU_HIDE, MENU_LANGUAGE,
  langMap,
  menuControl
} from '../../../Utils'

export function LanguagePickerButtonWithRedux({
  menu=MENU_HIDE,
  currTrans={},
}) {

  const handleMenuTrigger = () => {
    if (menu !== MENU_LANGUAGE) {
      menuControl.open(MENU_LANGUAGE)
    } else {
      menuControl.close()
    }
  }

  return (
    <WatchCtrlButton 
      onClick={handleMenuTrigger}
      active={menu === MENU_LANGUAGE}
      label={<>Current Language: {langMap[currTrans.language]} (SHIFT+L)</>}
      id={MENU_LANGUAGE}
      ariaTags={{
        'aria-label': `Language Menu`,
        //'aria-keyshortcuts': 'Shift+L',
        'aria-controls': 'watch-language-menu',
        'aria-haspopup': 'true'
      }}
    >
      <span aria-hidden="true" className="watch-btn-content" tabIndex="-1">
        <i className="material-icons">subtitles</i>     
      </span>
    </WatchCtrlButton>
  )
}

export const LanguagePickerButton = connectWithRedux(
  LanguagePickerButtonWithRedux,
  ['menu', 'currTrans'],
  []
)

