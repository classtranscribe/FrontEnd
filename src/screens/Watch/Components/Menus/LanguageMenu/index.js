import React from 'react'
import { connectWithRedux } from '_redux/watch'
import { transControl, langMap, langOptions } from '../../../Utils'

function LanguageMenu({
  show=false,
  openCC=false,
  currTrans={},
  onClose=null
}) {

  const handleChooseLanguage = lang => () => {
    if (lang === 'caption-switch') {
      transControl.closedCaption(!openCC)
      return;
    }
    transControl.setLanguage(lang)
    setTimeout(() => onClose(), 200);
  }

  return show ? (
    <div className="watch-general-menu">
      <button className="plain-btn watch-menu-close-btn watch-screenmode-menu-close-btn" onClick={onClose}>
        <i className="material-icons">close</i>
      </button>

      <div className="watch-icon-list" >
        {/* Closed Caption Off */}
        <button 
          key={`language-menu-item-caption-off`}
          className="plain-btn watch-icon-listitem"
          aria-label={openCC ? "Caption Off" : "Caption On"}
          onClick={handleChooseLanguage('caption-switch')}
        >
          <div className="screen-mode-listitem-checkmark">
            
          </div>
          <i className="material-icons watch-icon-icon">{!openCC ? 'speaker_notes' : 'speaker_notes_off'}</i>
          <div className="watch-icon-name">{openCC ? "Caption Off" : "Caption On"}</div>
        </button>
        {langOptions.map( lang => (
          <button 
            key={`language-menu-item-${lang}`}
            className="plain-btn watch-icon-listitem"
            aria-label={langMap[lang]}
            active={Boolean(lang === currTrans.language).toString()}
            onClick={handleChooseLanguage(lang)}
          >
            <div className="screen-mode-listitem-checkmark">
              {
                lang === currTrans.language
                && 
                <i className="material-icons">check</i>
              }
            </div>
            <i className="material-icons watch-icon-icon">closed_caption</i>
            <div className="watch-icon-name">{langMap[lang]}</div>
          </button>
        ))}
      </div>
    </div>
  ) : null
}

export default connectWithRedux(
  LanguageMenu,
  ['currTrans', 'openCC'],
  []
)