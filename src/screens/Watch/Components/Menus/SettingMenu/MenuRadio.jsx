import React from 'react'

function MenuRadio({
  description='',
  checked=false,
  label='',
  onChange=null,
  id=''
}) {

  return (
    <div className="menu-radio">
      <div className="menu-radio-line">
        <label className="radio-label" htmlFor={id}>{label}</label>
        <label className="ct-radio">
          <input aria-required="false" id={id} type="checkbox" checked={checked} onChange={onChange} />
          <span className="radio-slider round"></span> radio
        </label>
      </div>
      {description && <span className="menu-radio-description">{description}</span>}
    </div>
  )
}

export default MenuRadio