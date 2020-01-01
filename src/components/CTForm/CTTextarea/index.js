import React, { useRef, useEffect } from 'react'
import autosize from 'autosize'
import _ from 'lodash'
import './index.css'

export function CTTextarea({
  id='',
  row=1,
  label='',
  value,
  defaultValue='',
  placeholder='Input Here...',
  required=false,
  onChange,

  color='primary',
  classNames='',
}) {

  const textareaRef = useRef()

  useEffect(() => {
    autosize(textareaRef.current)
  }, [])

  const handleChange = ({ target: { value } }) => {
    if (onChange) onChange(value)
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

      <div className="ct-ipt-text">
        <div className="ct-ipt-input-con">
          <textarea
            id={id}
            ref={textareaRef}
            rows={row}
            required={required}
            className={`${classNames}`}
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  )
}