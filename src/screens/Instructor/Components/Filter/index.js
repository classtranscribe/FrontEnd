import React, { useState, useEffect } from 'react'
import { connectWithRedux } from '../../Utils'
import './index.scss'
import { Popup } from 'semantic-ui-react'

function FilterWithRedux({
  searchFor="",
  darker=false,
  onFilter,
  onReverse,

  playlist={}
}) {

  let [value, setValue] = useState('')
  let [reversed, setReversed] = useState(false)

  const handleInput = ({ target: { value } }) => {
    setValue(value)
    if (onFilter) onFilter(value)
  }

  const handleReverse = () => {
    if (onReverse) onReverse()
    setReversed( !reversed )
  }

  useEffect(() => {
    if (searchFor === "Videos") setReversed(false)
  }, [playlist])

  return (
    <div className="ip-filter">
      <div className="ip-filter-con" data-darker={darker.toString()}>
        <input 
          className="ip-filter-input"
          value={value}
          placeholder={`Filter ${searchFor}...`}
          onChange={handleInput}
        />

        <Popup inverted basic
          openOnTriggerMouseEnter
          openOnTriggerFocus
          closeOnTriggerBlur
          closeOnTriggerMouseLeave
          content="Reverse order"
          trigger={
            <button 
              className="plain-btn ip-filter-sort-btn" 
              onClick={handleReverse}
              data-active={reversed.toString()}
            >
              <span tabIndex="-1">
                <i className="material-icons">sort</i>
              </span>
            </button>
          }
        />
      </div>
    </div>
  )
}

export const Filter = connectWithRedux(
  FilterWithRedux,
  ['playlist'],
  []
)