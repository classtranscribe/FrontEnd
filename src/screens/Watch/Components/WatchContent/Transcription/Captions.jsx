import React, { useState } from 'react'
import { Input, Button } from 'semantic-ui-react'
import { Spinner } from 'react-bootstrap'
import { handleData, api } from 'utils'

export default function Captions({ captions, results, setReadyToEdit, handleExpand, setCurrTime, reLoadCaption }) {
  
  const lines = results.length ? results : captions
  return (
    <div 
      className="captions" 
      onMouseEnter={setReadyToEdit} 
      onMouseLeave={setReadyToEdit}
      id="captions"
    >
      {
        lines[0] === 'NOT FOUND' ? 
        <div className="h-100 d-flex justify-content-center p-3">No Match</div>
        :
        lines.map( line => (
          <CaptionLine 
            line={line} 
            key={line.id} 
            setCurrTime={setCurrTime} 
            handleExpand={handleExpand}
            reLoadCaption={reLoadCaption}
          />
        ))
      }
    </div>
  )
}

function CaptionLine({ line, setCurrTime, reLoadCaption, handleExpand }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { text, index, id, begin } = line

  const SeekToCaption = e => {
    setCurrTime(e, handleData.timeStrToSec(begin))
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

  if (isLoading) return <LineLoader index={index} />
  if (isEditing) return <LineEditor line={line} onClose={onClose} onSave={onSave} />

  return (
    <div className="line" id={`line-${index}`} >
      <div className="likes">
        {handleData.timeBetterLook(begin)}
        <Button compact className="icon">
          <i className="material-icons">thumb_down</i>
        </Button>&ensp;
        <span className="num">20</span>
        <Button compact className="icon">
          <i className="material-icons">thumb_up</i>
        </Button>&ensp;
        <span className="num">31</span>
      </div>

      <div 
        className="text" 
        tabIndex={1}
        onClick={SeekToCaption}
      >
        {text}&ensp;<i className="material-icons">play</i>
      </div>

      <div className="edit">
        <Button compact className="icon" onClick={onEditCaption}>
          <i className="material-icons">edit</i>
        </Button>
        <Button compact className="icon">
          <i className="material-icons">share</i>
        </Button>
      </div>
    </div>
  )
}

function LineEditor({ line, onClose, onSave }) {
  const { text, index, id, begin } = line
  const [newText, setNewText] = useState(text)
  const handleSave = () => {
    line.text = newText
    onSave(line)
  }
  const handleKeyDown = e => {
    if (e.keyCode === 13) handleSave()
  }
  return (
    <div className="line" id={`line-${index}`} >
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
  return (
    <div className="line d-flex justify-content-center" id={`line-${index}`} >
      <Spinner animation="border" variant="light" />
    </div>
  )
}
