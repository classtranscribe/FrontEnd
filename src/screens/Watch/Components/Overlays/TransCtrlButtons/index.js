/**
 * Overlay Button Group used in Transcription box
 */

import React from 'react'
import { connectWithRedux } from '_redux/watch'
import './index.css'
import { 
  transControl, searchControl, menuControl, 
  LINE_VIEW, TRANSCRIPT_VIEW, MENU_SETTING, 
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
    menuControl.open(MENU_SETTING)
  }

  const isLineView = transView === LINE_VIEW

  const buttonGroup = [
    {
      id: 'trans-setting-btn', 
      name: 'Settings', 
      icon: 'settings', 
      click: openTransSettingMenu,
      ariaTags: {
        'aria-controls': 'watch-setting-menu', 
        'aria-haspopup': 'true'
      }
    },
    {
      id: 'trans-view-switch-btn', 
      name: isLineView ? TRANSCRIPT_VIEW : LINE_VIEW, 
      icon: isLineView ? 'menu_book' : 'subject', 
      click: switchTranView,
      ariaTags: {}
    },
    {
      id: 'watch-search-btn', 
      name: 'Search Transcriptions', 
      icon: 'search', 
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
            <i className="material-icons">{btn.icon}</i>
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