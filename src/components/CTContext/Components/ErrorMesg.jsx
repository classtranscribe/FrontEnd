import React from 'react'
import { util } from '../../../utils'
import './ErrorMesg.css'

export default function ErrorMesg({ mesg, notFound404 }) {
  if (!mesg) return null

  // console.log('error', mesg)
  const { header, error, info } = mesg
  return (
    <div className="context-error">
      <div className="error-content">
        <a id="brand" className="ct-brand" href={util.links.home()} title="Home" aria-label="Home">
          <span>C</span>lass<span>T</span>ranscribe
        </a>
        <p className="error-header">{notFound404 ? '404 NOT FOUND' : 'Something wrong :('}</p>
        {header && <p className="error-subheader">{header}</p>}
        <p className="error-mesg">
        {info}{info && '. '}{(error && error.message) && error.message}
        </p>
        <div className="error-actions">
          <div className="d-flex flex-column">
            <a href={util.links.home()}>Back to Home</a>
            {!notFound404 && <a href={util.links.contactUs()}>Contact Us</a>}
          </div>
          {!notFound404 && <a id="reload" href={util.links.currentUrl()}>Reload Page</a>}
        </div>
      </div>
    </div>
  )
}