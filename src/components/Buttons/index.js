import React from 'react'
import './index.css'
import { Popup } from 'semantic-ui-react'

export function CTButton({
  id=`ct-btn-${Math.random()}`,
  classNames='',
  spanClassNames='',
  color='primary', // primary, light, green, yellow, black
  size='normal',
  icon=null,
  iconContent=null,
  circle=false,

  onClick=null,
  text='',
  disabled=false,

  popup=null,
  popupAttrs={},
  popupBasic=true,
  popupDelay=0,

  title,
  ariaLabel,
  ariaHasPopup,
  ariaControls,
}) {

  return (
    <Popup inverted 
      mouseEnterDelay={popupDelay}
      basic={popupBasic}
      disabled={!Boolean(popup)}
      openOnTriggerFocus
      closeOnTriggerBlur
      {...popupAttrs}
      content={popup}
      trigger={
        <button 
          id={id}
          className={`ct-btn ${classNames}`}
          data-font={size}
          data-color={color}
          data-icon={Boolean(icon).toString()}
          data-circle={circle.toString()}
          disabled={disabled}
          onClick={onClick}
          title={title}
          aira-label={Boolean(ariaLabel) ? ariaLabel : text}
          aria-haspopup={ariaHasPopup}
          aria-controls={ariaControls}
        >
          <span className="ct-btn-content" tabIndex="-1">
            {
              Boolean(icon) 
              && 
              <span className="ct-btn-icon" aria-hidden="true">
                {
                  Boolean(iconContent) ? 
                  iconContent : 
                  <i className="material-icons">{icon}</i>
                }
              </span>
            }
            {
              Boolean(text) 
              &&
              <span className={`ct-btn-text ${spanClassNames}`} aria-hidden="true">
                {text}
              </span>
            }
          </span>
        </button>
      }
    />
  )
}