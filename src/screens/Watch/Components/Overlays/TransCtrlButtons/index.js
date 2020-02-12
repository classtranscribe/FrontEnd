/**
 * Overlay Button Group used in Transcription box
 */

import React from 'react'
import { connectWithRedux } from '../../../../../_redux/watch'
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
import { STUDENT, INSTRUCTOR } from '../../../../../utils'

function TransCtrlButtonsWithRedux({
  transView=LINE_VIEW,
  userRole=STUDENT,
  bulkEditing=false,
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
    {
      id: 'trans-setting-btn', 
      name: 'Transcription Settings', 
      icon: <i className="fas fa-cogs"></i>, //settings
      click: openTransSettingMenu,
      ariaTags: {
        'aria-controls': 'watch-setting-menu', 
        'aria-haspopup': 'true'
      }
    },
    {
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

  return bulkEditing ? null : (
    <>
      {
        userRole === INSTRUCTOR
        &&
        <button 
          className="plain-btn trans-ctrl-btn"
          onClick={openBulkEdit}
          id="trans-bulk-edit-btn"
          aria-label="Bulk Edit"
        >
          <span className="trans-ctrl-btn-content" tabIndex="-1">
            <i className="material-icons">edit</i>
            <span className="trans-ctrl-btn-text">Bulk Edit</span>
          </span>
        </button>
      }
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
  ['transView', 'userRole', 'bulkEditing'],
  []
)