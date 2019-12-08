/**
 * Overlay Button Group used in Transcription box
 */

import React from 'react'
import { connectWithRedux } from '_redux/watch'
import './index.css'
import { 
  transControl, 
  searchControl, 
  menuControl, 
  LINE_VIEW, 
  TRANSCRIPT_VIEW, 
  MENU_SETTING, 
  SMTAB_TRANS,
  HIDE_TRANS, 
} from '../../../Utils'

function TransCtrlButtonsWithRedux({
  transView=LINE_VIEW
}) {

  const switchTranView = () => {
    transControl.handleTransViewSwitch()
  }

  const handleSearch = () => {
    searchControl.openSearch()
  }

  const openTransSettingMenu = () => {
    menuControl.open(MENU_SETTING, 'a', SMTAB_TRANS)
  }

  const isLineView = transView === LINE_VIEW
  const isHide = transView === HIDE_TRANS

  const buttonGroup = [
    {
      id: 'trans-setting-btn', 
      name: 'Settings', 
      icon: <i class="fas fa-cogs"></i>, //settings
      click: openTransSettingMenu,
      ariaTags: {
        'aria-controls': 'watch-setting-menu', 
        'aria-haspopup': 'true'
      }
    },
    {
      id: 'trans-view-switch-btn', 
      name: isLineView ? HIDE_TRANS : isHide ? TRANSCRIPT_VIEW : LINE_VIEW, 
      icon: <i className="material-icons">{isLineView ? 'close' : isHide ? 'menu_book' : 'subject'}</i>, 
      click: switchTranView,
      ariaTags: {}
    },
    {
      id: 'watch-search-btn', 
      name: 'Search Transcriptions', 
      icon: <i className="material-icons">search</i>, 
      click: handleSearch,
      ariaTags: {
        'aria-controls': 'watch-search-container', 
        'aria-haspopup': 'true'
      }
    }
  ]

  return (
    <>
      {buttonGroup.map( btn => (
        <button 
          className="plain-btn trans-ctrl-btn"
          onClick={btn.click}
          id={btn.id}
          key={btn.id}
          aria-label={btn.name}
          {...btn.ariaTags}
        >
          <span className="trans-ctrl-btn-content" tabIndex="-1">
            {btn.icon}
            <span className="trans-ctrl-btn-text">{btn.name}</span>
          </span>
        </button>
      ))}
    </>
  )
}

export const TransCtrlButtons = connectWithRedux(
  TransCtrlButtonsWithRedux,
  ['transView'],
  []
)