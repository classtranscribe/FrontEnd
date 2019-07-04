import React from 'react'
import { Placeholder } from 'semantic-ui-react'

export function OfferingInfoPlaceholder (props) {
  return (
    <Placeholder fluid>
      <Placeholder.Line length='full' />
      <Placeholder.Line length='long' />
      <Placeholder.Line length='medium' />
      <Placeholder.Line length='short' />
      <Placeholder.Line length='very short' />
    </Placeholder>
  );
}