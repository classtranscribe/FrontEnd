import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import './index.css'

export function CTCheckbox({
  id='',
  label='',
  value,
  defaultValue,
  description,
  required=false,
  onChange,

  color='primary',
  classNames='',
}) {

  const [checked, setChecked] = useState(Boolean(defaultValue))

  const handleChange = () => {
    if (onChange) onChange( !checked )
    setChecked( !checked )
  }

  return (
    <div 
      className="ct-ipt-con"
      data-color={color}
    >
      <div className="ct-ipt-cb-con">
        <div className="ct-ipt-cb">
          <input
            id={id}
            type="checkbox"
            required={required}
            checked={checked}
            className={`${classNames}`}
            onChange={handleChange}
          />
        </div>

        <label className="ct-ipt-cb-label" htmlFor={id}>
          {label}
          {
            required
            &&
            <span className="ct-ipt-required-icon" aria-hidden="true">*</span>
          }
        </label>
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