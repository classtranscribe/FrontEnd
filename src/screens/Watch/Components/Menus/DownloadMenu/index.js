import React, { useState } from 'react'
import { connectWithRedux } from '_redux/watch'
import { Spinner } from 'react-bootstrap'
import { 
  downloadControl, 
  transControl, 
  langMap, langOptions 
} from '../../../Utils'
import { api } from 'utils'
import './index.css'

var fileDownload = require('js-file-download')

function DownloadMenu({
  show=false,
  onClose=null
}) {

  const [downloading, setDownloading] = useState('')
  const [disabledList, setDisabledList] = useState([])

  const langList = langOptions.map(language => transControl.findTransByLanguage(language) || { language })

  const handleDownload = (path, type, info) => async () => {
    setDownloading(info)
    downloadControl.webVTT(
      path, info,
      () => setTimeout(() => setDownloading(''), 400),
      () => {
        setDisabledList([...disabledList, path])
        setDownloading('')
      }
    )
  }

  return show ? (
    <div id="watch-download-menu" role="menu" aria-label="Download Menu" className="watch-general-menu" position="top">
      <button className="plain-btn watch-menu-close-btn watch-screenmode-menu-close-btn" onClick={onClose}>
        <i className="material-icons">close</i>
      </button>
      <h3 className="watch-download-menu-title">
        <i className="material-icons watch-icon-icon">speaker_notes</i>
        TRANSCRIPTIONS <span className="file-type">WebVTT</span>
      </h3>
      <div className="watch-icon-list" >
        {langList.map( lang => (
          <button 
            key={`language-menu-item-${lang.language}`}
            className="plain-btn watch-icon-listitem"
            aria-label={langMap[lang.language]}
            onClick={handleDownload(lang.src, 'trans', langMap[lang.language])}
            disabled={!Boolean(lang.id) || disabledList.includes(lang.src)}
          >
            {
              downloading === langMap[lang.language] ?
              <div className="watch-downloading"><Spinner variant="light" animation="border" /></div>
              :
              <i className="material-icons watch-icon-icon">arrow_downward</i>
            }
            <div className="watch-icon-name">{langMap[lang.language]}</div>
          </button>
        ))}
      </div>
    </div>
  ) : null
}

export default connectWithRedux(
  DownloadMenu,
  [],
  []
)