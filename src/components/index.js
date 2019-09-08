import React from 'react'
import './index.css'

export { CTContext, useCTContext, CTContextProvider } from './CTContext' 
export { ClassTranscribeHeader } from './Header'
export { FixedFooter, ClassTranscribeFooter } from './Footer'
export { GeneralModal, DeleteModal } from './Modals'
export { GeneralAlert } from './Alerts'
export { UpLoadVideosContainer } from './uploading'
export { GeneralLoader, GeneralPlaceholder, SpinnerLoader } from './Loaders' 

/**
 * General Components
 */

/**
 * Padding Component
 */
export const EndPadding5rem = () => <div className="end-padding"></div>

export function SidebarDimmer({show, onClose}) {
  return <div style={{display: show ? 'block' : 'none'}} className="sidebar-dimmer" onClick={onClose}></div>
}