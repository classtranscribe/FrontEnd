import React from 'react'
import { connectWithRedux } from '_redux/watch'
import { Popup } from 'semantic-ui-react'
import './index.css'
import { transControl, LINE_VIEW, TRANSCRIPT_VIEW } from '../../../Utils'

function TransCtrlButtonsWithRedux({
  transView
}) {

  const switchTranView = () => {
    transControl.handleTransViewSwitch()
  }

  const handleSearch = () => {

  }

  const isLineView = transView === LINE_VIEW

  return (
    <>
      <button 
        className="plain-btn trans-ctrl-btn"
        onClick={switchTranView}
        id="trans-view-switch-btn"
        aria-label="Switch Transcript View"
      >
        <span className="trans-ctrl-btn-content" tabIndex="-1">
          <i className="material-icons">{isLineView ? 'menu_book' : 'subject'}</i>
          <span className="trans-ctrl-btn-text">{isLineView ? TRANSCRIPT_VIEW : LINE_VIEW}</span>
        </span>
      </button>

      <button 
        className="plain-btn trans-ctrl-btn"
        onClick={handleSearch}
        id="watch-search-btn"
        aria-label="Search"
      >
        <span className="trans-ctrl-btn-content" tabIndex="-1">
          <i className="material-icons">search</i>
          <span className="trans-ctrl-btn-text">Search Transcriptions</span>
        </span>
      </button>
    </>
  )
}

export const TransCtrlButtons = connectWithRedux(
  TransCtrlButtonsWithRedux,
  ['transView'],
  []
)