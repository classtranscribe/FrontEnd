import React from 'react'
import { PlaylistIcon } from '../PlaylistIcon'
import './index.scss'

export function ListItem({
  icon=null,
  title='',
  subtitle='',
  description='',

  dark=false,
  disabled=false,
  current=false,
  rightIcon='none', // small, normal

  onClick=null,
}) {
  return (
    <button 
      className={`plain-btn ip-li-btn ${dark ? 'dark' : ''}`} 
      data-current={current}
      onClick={current ? null : onClick}
      disabled={disabled}
    >
      <div tabIndex="-1" className="ip-li-btn-con">
        {
          title
          &&
          <span className="ip-li-text ip-li-t">
            {
              (typeof icon === "string")
              ?
              <i className="material-icons" aria-hidden="true">{icon}</i>
              :
              (typeof icon === "number")
              ?
              <PlaylistIcon type={icon} svgSize="normal" />
              :
              null          
            }
            {title}
          </span>
        }
        {
          subtitle
          &&
          <span className="ip-li-text ip-li-subt">
            {subtitle}
          </span>
        }
        {
          description
          &&
          <span className="ip-li-text ip-li-d">
            {description}
          </span>
        }
        {
          rightIcon != 'none'
          &&
          <span className="ip-li-r-i" data-size={rightIcon} aria-hidden="true">
            <i className="material-icons">chevron_right</i>
          </span>
        }
      </div>
    </button>
  )
}