import React from 'react'
import _ from 'lodash'
import { connectWithRedux } from '_redux/watch'
import WatchCtrlButton from './WatchCtrlButton'
import { 
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
      label={<>Current Language: <strong>{langMap[currTrans.language]}</strong></>}
      ariaLabel="Language Menu"
      id={MENU_LANGUAGE}
    >
      <span className="watch-btn-content" tabIndex="-1">
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

