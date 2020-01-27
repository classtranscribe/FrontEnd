import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import './index.css'

export function CTSelect({
  id='',
  required=false,
  label='',
  color='primary',
  options=[],
  value,
  description,
  placeholder,
  defaultValue,
  onChange,
}) {

  if (!value) value = defaultValue
  const [selOpt, setSelOpt] = useState( _.find( options, { value } ) || {})

  useEffect(() => {
    if (Boolean(defaultValue) && options.length > 0) {
      let selOpt_ = _.find(options, { value: defaultValue }) || {}
      setSelOpt(selOpt_)
    }
  }, [defaultValue])

  const handleSelect = opt => () => {
    setSelOpt(opt)
    if (onChange) onChange(opt.value)
    if (document.activeElement) document.activeElement.blur()
  }

  const handleKeydownSelect = opt => e => {
    if (e.keyCode === 13) {
      handleSelect(opt)()
    }
  }

  return (
    <div 
      className="ct-ipt-con"
      data-color={color}
    >
      <label className="ct-ipt-label" htmlFor={id}>
        {label}
        {
          required
          &&
          <span className="ct-ipt-required-icon" aria-hidden="true">*</span>
        }
      </label>

      <div className="ct-ipt">
        <div 
          className="ct-ipt-sel-con" 
          tabIndex="0" 
        >
          <div id={id} className="ct-ipt-sel" tabIndex="-1">
            {
              Boolean(selOpt.value !== undefined) ?
              <span className="ct-ipt-sel-text">{selOpt.text}</span>
              :
              <span className="ct-ipt-sel-text ct-ipt-sel-ph">{placeholder}</span>
            }
            <div className="ct-ipt-sel-drop-icon"><i className="material-icons">arrow_drop_down</i></div>
          </div>
        </div>
        <div className="ct-ipt-sel-opts">
            {options.map( opt => (
              <div 
                key={opt.value}
                tabIndex="0" 
                className="ct-ipt-sea-opt ct-ipt-sel-opt"
                onClick={handleSelect(opt)}
                onKeyDown={handleKeydownSelect(opt)}
                data-current={Boolean(opt.value === selOpt.value)}
              >
                {opt.text}
                {opt.detail && <span>{opt.detail}</span>}
              </div>
            ))}
          </div>
      </div>

      {
        Boolean(description)
        &&
        <div className="ct-ipt-description">
          {description}
        </div>
      }
    </div>
  )
}

export function getOptions(array, valueKeys, textKeys, detailKey) {
  return _.map(array, item => {
    let value = ''
    if (typeof valueKeys === "string") {
      value = _.get(item, valueKeys)
    } else {
      _.forEach(valueKeys, v => {
        value += _.get(item, v)
      })
    }

    let text = ''
    if (typeof textKeys === "string") {
      text = _.get(item, textKeys)
    } else {
      _.forEach(textKeys, t => {
        text += _.get(item, t)
      })
    }

    let detail = undefined
    if (detailKey) detail = _.get(item, detailKey)

    return { value, text, detail }
  })
}