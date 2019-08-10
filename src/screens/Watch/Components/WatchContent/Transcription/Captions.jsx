import React, { useState, useEffect } from 'react'
import $ from 'jquery'
import { Input, Button } from 'semantic-ui-react'
import { Spinner } from 'react-bootstrap'
import { api } from 'utils'
import { timeStrToSec, timeBetterLook, handleExpand } from '../watchUtils'

function copyToClipboard(text) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val(text).select();
  document.execCommand("copy");
  $temp.remove();
}

export default function Captions({ media, captions, results, setReadyToEdit, setCurrTime, reLoadCaption, loadingCaptions }) {
  if (loadingCaptions) return <LineLoader index={-1} />
  const lines = results.length ? results : captions
  return (
    <div 
      className="captions" 
      onMouseEnter={() => setReadyToEdit(true)} 
      onMouseLeave={() => setReadyToEdit(false)}
      id="captions"
    >
      {
        lines[0] === 'NOT FOUND' ? 
        <div className="h-100 d-flex justify-content-center p-3">No Match</div>
        :
        lines.map( line => (
          <CaptionLine 
            media={media}
            line={line} 
            key={line.id} 
            setCurrTime={setCurrTime} 
            handleExpand={handleExpand}
            reLoadCaption={reLoadCaption}
            setReadyToEdit={setReadyToEdit}
          />
        ))
      }
    </div>
  )
}

function CaptionLine({ media, line, setCurrTime, reLoadCaption, handleExpand, setReadyToEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const { text, index, id, begin } = line

  useEffect(() => {
    
  }, [line])

  const SeekToCaption = e => {
    setCurrTime(e, timeStrToSec(begin))
    handleExpand(false)
  }

  const onEditCaption = () => {
    setIsLoading(() => true)
    reLoadCaption(() => {
      setIsEditing(() => true)
      setIsLoading(() => false)
    })
  }

  const onClose = () => {
    setIsEditing(() => false)
  }

  const onSave = line => {
    api.updateCaptionLine(line, () => {
      console.log('success update line')
    })
    onClose()
  }

  const onShare = () => {
    setIsLoading(true)
    const sharedUrl = `${window.location.href}?begin=${timeStrToSec(begin)}`
    copyToClipboard(sharedUrl)
    setTimeout(() => {
      setIsLoading(false)
      setIsSharing(true)
      setTimeout(() => {
        setIsSharing(false)
      }, 1600);
    }, 600);
  }

  const onFocus = ({ target }) => {
    // setReadyToEdit(true)
    // document.getElementById('captions').scrollTop = target.offsetTop - 50
  }

  const onBlur = () => {} //setReadyToEdit(false)

  if (isLoading) return <LineLoader index={index} />
  if (isEditing) return <LineEditor line={line} onClose={onClose} onSave={onSave} />
  if (isSharing) return <LineCopiedPopup index={index} />

  return (
    <div className="line" id={`line-${index}`}>
      <div className="likes">
        {timeBetterLook(begin)}
        <Button 
          compact className="icon thumbdown" 
          title="Like" aria-label="Like"
          onFocus={onFocus} onBlur={onBlur}
        >
          <i className="material-icons">thumb_down</i>20
        </Button>
        <Button 
          compact className="icon thumbup" 
          title="Dislike" aria-label="Dislike"
          onFocus={onFocus} onBlur={onBlur}
        >
          <i className="material-icons">thumb_up</i>31
        </Button>
      </div>

      <div 
        className="text" 
        tabIndex={0}
        onClick={SeekToCaption}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {text}&ensp;<i className="material-icons">play</i>
      </div>

      <div className="edit">
        <Button 
          compact className="icon editBtn" 
          title="edit" aria-label="edit"
          onClick={onEditCaption} onFocus={onFocus} onBlur={onBlur}
        >
          <i className="material-icons">edit</i>
        </Button>
        <Button 
          compact className="icon shareBtn" 
          title="share" aria-label="share"
          onClick={onShare} onFocus={onFocus} onBlur={onBlur}
        >
          <i className="material-icons">share</i>
        </Button>
      </div>
    </div>
  )
}

function LineEditor({ line, onClose, onSave }) {
  const { text, index, /* id, begin */ } = line
  const [newText, setNewText] = useState(text)
  const handleSave = () => {
    line.text = newText
    onSave(line)
  }
  const handleKeyDown = e => {
    if (e.keyCode === 13) handleSave()
  }
  return (
    <div className="line line-edit" id={`line-${index}`}>
      <Button compact className="edit-button" onClick={onClose}>
        Cancel
      </Button>
      <Input 
        defaultValue={text} autoFocus
        onChange={({target: {value}}) => setNewText(() => value)} 
        onKeyDown={handleKeyDown}
      />
      <Button compact className="edit-button" onClick={handleSave}>
        Save
      </Button>
    </div>
  )
}

function LineLoader({ index }) {
  const style = index < 0 ? {marginTop: '3em'} : {}
  return (
    <div className="line d-flex justify-content-center" id={`line-${index}`} style={style}>
      <Spinner animation="border" variant="light" />
    </div>
  )
}

function LineCopiedPopup({ index }) {
  return (
    <div className="line d-flex justify-content-center copied" id={`line-${index}`}>
      <i class="material-icons">done_all</i>&ensp;Sharable Link Copied!
    </div>
  )
}
