import React from 'react'

function MenuRadio({
  description='',
  checked=false,
  label='',
  onChange=null,
  id=''
}) {

  const onKeyDown = ({ keyCode }) => {
    if (keyCode === 13) onChange()
  }

  return (
    <div className="menu-radio">
      <div className="menu-radio-line">
        <div className="w-100 d-flex flex-row">
          <label className="radio-label" htmlFor={id}>{label}</label>
          <label className="ct-radio">
            <input 
              aria-required="false" 
              id={id} 
              type="checkbox" 
              checked={checked} 
              onChange={onChange} 
              onKeyDown={onKeyDown}
            />
            <span className="radio-slider round"></span> radio
          </label>
        </div>
        {description && <span className="menu-radio-description">{description}</span>}
      </div>
    </div>
  )
}

export default MenuRadio