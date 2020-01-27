import React from 'react'
import _ from 'lodash'
import './index.css'

export function CTInput({
  id='',
  label='',
  defaultValue,
  value,
  description,
  placeholder='Input Here...',
  required=false,

  type,
  color='primary',
  error,
  info=null,
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
      <div className="ct-ipt-label" data-error={Boolean(error)}>
        {label}
        {
          required
          &&
          <span className="ct-ipt-required-icon" aria-hidden="true">*</span>
        }
        {info}
      </div>

      <label htmlFor={id} className="ct-ipt-text" data-error={Boolean(error)}>
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
      </label>
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