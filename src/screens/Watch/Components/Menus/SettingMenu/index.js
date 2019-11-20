import React, { useState } from 'react'
import TranscriptionSetting from './TranscriptionSetting'
import CCSetting from './CCSetting'
import './index.css'

const TAB_TRANS = 'tab-cc'
const TAB_CC = 'tab-ad'

const panes = [
  { id:TAB_TRANS, name: 'Transcriptions', icon: 'menu_book' },
  { id:TAB_CC, name: 'Closed Captions', icon: 'closed_caption' }
]

function SettingMenu({
  show=false,
  onClose=null,
}) {

  const [tab, setTab] = useState(TAB_TRANS)

  const changeTab = tabId => () => {
    setTab(tabId)
  }

  return show ? (
    <div className="watch-setting-menu">
      <button className="plain-btn watch-menu-close-btn watch-screenmode-menu-close-btn" onClick={onClose}>
        <i className="material-icons">close</i>
      </button>
      <div className="setting-content">
        <div className="setting-tabs">
          {panes.map(pane => (
            <button 
              key={pane.id}
              className="plain-btn watch-icon-listitem"
              aria-label={pane.name}
              active={Boolean(tab === pane.id).toString()}
              onClick={changeTab(pane.id)}
            >
              <i className="material-icons watch-icon-icon">{pane.icon}</i>
              <div className="watch-icon-name">{pane.name}</div>
            </button>
          ))}
        </div>

        {
          tab === TAB_TRANS
          &&
          <TranscriptionSetting />
        }
        {
          tab === TAB_CC
          &&
          <CCSetting />
        }

      </div>
    </div>
  ) : null
}

export default SettingMenu