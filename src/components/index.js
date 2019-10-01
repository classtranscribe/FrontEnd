import React, { useState } from 'react'
import { Alert } from 'react-bootstrap'
import './index.css'
import './sidebar.css'

export { CTContext, useCTContext, CTContextProvider } from './CTContext' 
export { ClassTranscribeHeader } from './Header'
export { FixedFooter, ClassTranscribeFooter } from './Footer'
export { GeneralModal, DeleteModal } from './Modals'
export { GeneralAlert } from './Alerts'
export { GeneralLoader, GeneralPlaceholder, SpinnerLoader } from './Loaders' 
export { Poster } from './Poster'

/**
 * General Components
 */

export function MaintenanceMessage({ }) {
  const begin = new Date('2019-09-26T00:00:00')
  const end = new Date('2019-09-28T22:00:00')
  const current = new Date()
  const [open, setOpen] = useState(current >= begin && current <= end)
  return (
    <Alert
      show={open}
      dismissible
      onClose={() => setOpen(false)}
      variant="primary"
    >
      <i className="material-icons">announcement</i>
      <p>
        ClassTranscribe will be down from <strong>September 27 10:00pm</strong> to <strong>September 28 10:00pm</strong>. Thanks for your patience.
      </p>
    </Alert>
  )
}

/**
 * Padding Component
 */
export const EndPadding5rem = () => <div className="end-padding"></div>

export function SidebarDimmer({show, onClose}) {
  return <div style={{display: show ? 'block' : 'none'}} className="sidebar-dimmer" onClick={onClose}></div>
}