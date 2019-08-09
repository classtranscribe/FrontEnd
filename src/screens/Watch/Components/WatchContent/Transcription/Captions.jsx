import React, { useState, useEffect } from 'react'
import { GeneralLoader } from 'components'
import { Input, Button } from 'semantic-ui-react'
import { Spinner } from 'react-bootstrap'
import Clipboard from 'clipboard'
import { api } from 'utils'
import { timeStrToSec, timeBetterLook, handleExpand } from '../watchUtils'

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

  // const sharedUrl = `${window.location.href}?begin=${timeStrToSec(begin)}`
  // var clipboard = new Clipboard('.shareBtn', {
  //   text: () => sharedUrl
  // })

  const onShare = () => {
    
    // console.log(sharedUrl)
    // clipboard.on('success', () => console.log('copied'))
  }

  const onFocus = ({ target }) => {
    // setReadyToEdit(true)
    // document.getElementById('captions').scrollTop = target.offsetTop - 50
  }

  const onBlur = () => {} //setReadyToEdit(false)

  if (isLoading) return <LineLoader index={index} />
  if (isEditing) return <LineEditor line={line} onClose={onClose} onSave={onSave} />

  return (
    <div className="line" id={`line-${index}`}>
      <div className="likes">
        {timeBetterLook(begin)}
        <Button compact className="icon" onFocus={onFocus} onBlur={onBlur}>
          <i className="material-icons">thumb_down</i>
        </Button>&ensp;
        <span className="num">20</span>
        <Button compact className="icon" onFocus={onFocus} onBlur={onBlur}>
          <i className="material-icons">thumb_up</i>
        </Button>&ensp;
        <span className="num">31</span>
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
        <Button compact className="icon" onClick={onEditCaption} onFocus={onFocus} onBlur={onBlur}>
          <i className="material-icons">edit</i>
        </Button>
        <Button compact className="icon shareBtn" onFocus={onFocus} onBlur={onBlur}>
          <i className="material-icons" onClick={onShare}>share</i>
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
    <div className="line" id={`line-${index}`}>
      <Input 
        defaultValue={text} 
        onChange={({target: {value}}) => setNewText(() => value)} 
        onKeyDown={handleKeyDown}
      />
      <div>
        <Button compact className="edit-button" onClick={handleSave}>
          Save
        </Button>
        <Button compact className="edit-button" onClick={onClose}>
          Cancel
        </Button>
      </div>
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
