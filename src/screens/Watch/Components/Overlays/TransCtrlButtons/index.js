/**
 * Overlay Button Group used in Transcription box
 */

import React from 'react'
import './index.css'
import { 
  connectWithRedux,
  transControl, 
  searchControl, 
  menuControl, 
  LINE_VIEW, 
  TRANSCRIPT_VIEW, 
  MENU_SETTING, 
  SMTAB_TRANS,
  HIDE_TRANS, 
} from '../../../Utils'
import { STUDENT, INSTRUCTOR } from '../../../../../utils'
import { isMobile } from 'react-device-detect'

function TransCtrlButtonsWithRedux({
  transView=LINE_VIEW,
  userRole=STUDENT,
  bulkEditing=false,
  isFullscreen=false,
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

  const openBulkEdit = () => {
    transControl.bulkEdit(true)
  }

  const isLineView = transView === LINE_VIEW
  const isHide = transView === HIDE_TRANS

  const buttonGroup = [
    (userRole === INSTRUCTOR && !isMobile) ? {
      id: 'trans-bulk-edit-btn', 
      name: 'Bulk Edit', 
      icon: <i className="material-icons">edit</i>,
      click: openBulkEdit,
      ariaTags: {}
    } : null,
    isMobile ? null : {
      id: 'trans-setting-btn', 
      name: 'Transcription Settings', 
      icon: <i className="fas fa-cogs"></i>, //settings
      click: openTransSettingMenu,
      ariaTags: {
        'aria-controls': 'watch-setting-menu', 
        'aria-haspopup': 'true'
      }
    },
    isMobile ? null : {
      id: 'trans-view-switch-btn', 
      name: isLineView ? TRANSCRIPT_VIEW : isHide ? LINE_VIEW : HIDE_TRANS, 
      icon: <i className="material-icons">{isLineView ? 'menu_book' : isHide ? 'subject' : 'close'}</i>, 
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

  return (bulkEditing || isFullscreen) ? null : (
    <>
      {buttonGroup.map( btn => btn ? (
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
      ) : null)}
    </>
  )
}

export const TransCtrlButtons = connectWithRedux(
  TransCtrlButtonsWithRedux,
  ['transView', 'userRole', 'bulkEditing', 'isFullscreen'],
  []
)