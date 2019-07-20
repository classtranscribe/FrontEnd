import React from 'react'
import {  Placeholder } from 'semantic-ui-react'

export function HeaderPlaceholder() {
  return (
    <div className="pl-header-placeholder">
      <Placeholder className="type-icon" >
        <Placeholder.Image />
      </Placeholder>
      <Placeholder className="name">
        <Placeholder.Image />
      </Placeholder>
    </div>
  )
}