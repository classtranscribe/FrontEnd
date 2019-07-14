import React from 'react'
import { Card } from 'react-bootstrap'
import { Placeholder } from 'semantic-ui-react'

export function OfferingCardHolder() {
  return (
    <Card className="offeringCard">
      <Placeholder>
        <Placeholder.Image style={{height: '9rem', width: '16rem'}}/>
      </Placeholder>
      <Card.Body style={{marginTop: '-0.8rem'}}>
        <Placeholder>
          <Placeholder.Header>
            <Placeholder.Line length='long' />
            <Placeholder.Line length='short' />
          </Placeholder.Header>
          <Placeholder.Paragraph>
            <Placeholder.Line length='short' />
            <Placeholder.Line length='long' />
            <Placeholder.Line length="medium" />
          </Placeholder.Paragraph>
        </Placeholder>
      </Card.Body>
    </Card>
  )
}