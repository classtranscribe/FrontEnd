import React, { useState } from 'react'
import { 
  transControl, 
  videoControl,
  timeStrToSec,
} from '../../../Utils'

export default function Caption({
  caption,
  actualIndex,
}) {

  const { text, index, begin, end, id } = caption

  // const [textVal, setTextVal] = useState(text)
  // const [beginVal, setBeginVal] = useState(begin.slice(0,11))
  // const [endVal, setEndVal] = useState(end.slice(0,11))

  const seekTo = () => {
    let time = timeStrToSec(begin)
    videoControl.currTime(time)
  }

  const onEdit = (e, key) => {
    let value = e.currentTarget.innerHTML
    transControl.bulkEditOnChange(actualIndex, key, value)
  }

  const beginOnInput = e => onEdit(e, 'begin')
  const endOnInput = e => onEdit(e, 'end')
  const textOnInput = e => onEdit(e, 'text')

  const onMergeDown = () => {
    transControl.bulkEditOnMergeDown(actualIndex)
  }

  const onDelete = () => {
    transControl.bulkEditOnDelete(actualIndex)
  }

  const onInsertAbove = () => {
    transControl.bulkEditOnInsert(actualIndex)
  }

  return (
    <tr id={`bulk-edit-capline-${actualIndex}`}>
      {/* Index/Seek Button */}
      <td className="td-center td-index">
        <button className="plain-btn watch-search-btn page-btn" onClick={seekTo}>
          <span tabIndex="-1">{actualIndex + 1}</span>
        </button>
      </td>

      {/* Time */}
      <td contentEditable className="td-center td-time" onInput={beginOnInput}>
        {begin.slice(0,11)}
      </td>
      <td contentEditable className="td-center td-time" onInput={endOnInput}>
        {end.slice(0,11)}
      </td>

      {/* Text */}
      <td contentEditable placeholder="Caption Text" className="td-border td-text" onInput={textOnInput}>
        {text}
      </td>

      {/* Buttons */}
      <td className="td-center">
        <div className="td-btns">
          <button className="plain-btn td-btn" onClick={onMergeDown}>
            <span tabIndex="-1">Merge Down</span>
          </button>
          <button className="plain-btn td-btn td-btn-delete" onClick={onDelete}>
            <span tabIndex="-1">
              <i className="material-icons">delete</i>
            </span>
          </button>
        </div>
      </td>
      <button className="plain-btn td-btn tr-add-btn" onClick={onInsertAbove}>
        <span tabIndex="-1">
          <i className="material-icons">add</i> 
        </span>
      </button>
    </tr>
  )
}