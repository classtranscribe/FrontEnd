import React from 'react'
import { Link } from 'react-router-dom'
import { PlaylistIcon } from '../PlaylistIcon'
import './index.scss'

export function ListItem({
  asLink=false,
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
  to='',
}) {

  const listItemContent = (
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
  )

  return asLink ? (
    <Link
      className={`plain-btn ip-li-btn ${dark ? 'dark' : ''}`} 
      data-current={current}
      disabled={disabled}
      to={to}
      onClick={onClick}
    >
      {listItemContent}
    </Link>
  ) : (
    <button 
      className={`plain-btn ip-li-btn ${dark ? 'dark' : ''}`} 
      data-current={current}
      onClick={current ? null : onClick}
      disabled={disabled}
    >
      {listItemContent}
    </button>
  )
}