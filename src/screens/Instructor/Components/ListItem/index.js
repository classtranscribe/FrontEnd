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
  image,
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
          image
          &&
          <div>
            <img src={image} aria-hidden="true" />
          </div>
        }
        <div className={"ct-d-c " + (image ? 'w-50' : 'w-100')}>
          {
            title
            &&
            <div className="ip-li-text-con ip-li-t">
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
              <span className="ip-li-text">{title}</span>
            </div>
          }
          {
            subtitle
            &&
            <span className="ip-li-text-con ip-li-subt">
              <span className="ip-li-text">{subtitle}</span>
            </span>
          }
          {
            description
            &&
            <span className="ip-li-text-con ip-li-d">
              <span className="ip-li-text">{description}</span>
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
      </div>

    </button>
  )
}