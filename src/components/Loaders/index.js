import React from 'react'
import { Dimmer, Loader, Placeholder } from 'semantic-ui-react'
import './index.css'

export function SpinnerLoader({ children }) {
  return (
    <div className="ct-loader">
      <ul class="spinner">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      {children}
    </div>
  )
}

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