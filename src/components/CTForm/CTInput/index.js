import React from 'react'
import _ from 'lodash'
import './index.css'

export function CTInput({
  id='',
  label='',
  value,
  defaultValue='',
  description,
  placeholder='Input Here...',
  required=false,

  type="text",
  color='primary',
  error,
  classNames='',

  onChange,
  onReturn,
}) {

  const handleChange = ({ target: { value } }) => {
    if (onChange) onChange(value)
  }

  const onKeyDown = ({ keyCode, target: { value } }) => {
    if (keyCode === 13) {
      if (onReturn) onReturn(value)
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

      <div className="ct-ipt-text" data-error={Boolean(error)}>
        <div className="ct-ipt-input-con">
          <input
            id={id}
            type={type}
            required={required}
            className={`${classNames}`}
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            onChange={handleChange}
            onKeyDown={onKeyDown}
          />
        </div>
      </div>
      {
        Boolean(description)
        &&
        <div className="ct-ipt-description">
          {description}
        </div>
      }
      {
        Boolean(error)
        &&
        <div className="ct-ipt-description ct-ipt-error">
          {error}
        </div>
      }
    </div>
  )
}