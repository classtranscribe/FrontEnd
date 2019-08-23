import React from 'react'
import { Dimmer, Loader, Placeholder } from 'semantic-ui-react'
import './index.css'

export { ClassTranscribeHeader } from './Header'
export { FixedFooter, ClassTranscribeFooter } from './Footer'
export { GeneralModal, DeleteModal } from './Modals'
export { GeneralAlert } from './Alerts'
export { UpLoadVideosContainer } from './uploading'

/**
 * General Components
 */

/**
 * Padding Component
 */
export const EndPadding5rem = () => <div className="end-padding"></div>

/**
 * Spinning Loader wrapper while loading data
 */
export function GeneralLoader({loading, inverted, height}) {
  return (
    <Dimmer active={loading} inverted={inverted} style={{height: height, background: 'transparent'}}>
      <Loader inverted={inverted}>Loading</Loader>
    </Dimmer>
  )
}

export function GeneralPlaceholder({fluid, lines, image, inverted}) {
  return (
    <Placeholder fluid={fluid} inverted={inverted}>
      <Placeholder.Header image={image}>
        <Placeholder.Line />
        <Placeholder.Line />
        {lines && lines.map( (length, index) => (
          <Placeholder.Line key={length + index} length={length} />
        ))}
      </Placeholder.Header>
    </Placeholder>
  )
}

export function SidebarDimmer({show, onClose}) {
  return <div style={{display: show ? 'block' : 'none'}} className="sidebar-dimmer" onClick={onClose}></div>
}