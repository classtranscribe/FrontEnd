import React, { useRef, useEffect, useState } from 'react'
import {
  getShareableURL,
  videoControl,
  parseSec,
} from '../../../Utils'
import './index.css'

function ShareModal({
  show=false,
  onClose,
}) {

  const inputRef = useRef()
  const [begin, setBegin] = useState(-1) // -1 X, >0 √
  const [copy, setCopy] = useState(0) // -1 unset, 0 copying, 1 copied

  const onCopy = () => {
    inputRef.current.select()
    document.execCommand("copy")
    setCopy(1)
    inputRef.current.blur()
    setTimeout(() => setCopy(-1), 2000);
  }

  const onRadioChange = () => {
    if (begin >= 0) {
      setBegin(-1)
    } else {
      setBegin(videoControl.currTime())
    }
  }

  useEffect(() => {
    if (show) {
      setBegin(videoControl.currTime())
    }
  }, [show])

  const shareURL = getShareableURL(begin)

  return (
    <div id="watch-share-modal" className="wmodal-box-gen" data-position="right top">
      <div className="wml-header">
        <h3>
          <i className="material-icons" aria-hidden="true">share</i>
          Share Video
        </h3>
        <button className="plain-btn wml-close-btn" aria-label="Close" onClick={onClose}>
          <span tabIndex="-1">
            <i className="material-icons">close</i>
          </span>
        </button>
      </div>

      <div className="wml-content">
        <div className="w-100 d-flex align-items-center wml-share-url">
          <input 
            ref={inputRef}
            className="plain-btn wml-share-url-input"
            value={shareURL}
            onChange={() => null}
          />
          <button 
            className="plain-btn wml-share-url-cpy" 
            aria-label="Copy"
            onClick={onCopy} 
            data-copyed={Boolean(copy > 0).toString()}
            disabled={copy > 0}
          >
            <span tabIndex="-1">
              {
                copy > 0 
                ? <><i className="material-icons">check</i>COPIED</> 
                : <><i className="material-icons">file_copy</i>COPY</>
              }
            </span>
          </button>
        </div>

        <div className="w-100 wml-share-radio">
          <label className="ct-radio">
            <input 
              aria-required="false" 
              id="wml-share-radio" 
              type="checkbox" 
              checked={begin >= 0} 
              onChange={onRadioChange} 
            />
            <span className="radio-slider round"></span> radio
          </label>

          <label className="wml-share-radio-label" htmlFor="wml-share-radio">
            Share video with current time:
          </label>

          <div className="wml-share-time" data-show={Boolean(begin >= 0).toString()}>
            <input readOnly
              aria-label="time"
              id="wml-share-time"
              className="plain-btn"
              value={parseSec(videoControl.currTime())}
            />
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default ShareModal