/**
 * Placeholders for Home screen
 */
import React from 'react'
import { Card } from 'react-bootstrap'
import { Placeholder } from 'semantic-ui-react'

/**
 * Placeholder shows up when a offering is loading
 */
export function OfferingCardHolder() {
  return (
    <Card className="offeringCard">
      <Placeholder>
        <Placeholder.Image style={{height: '9rem', width: '16rem'}}/>
      </Placeholder>
      <Card.Body>
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

/**
 * Placeholder shows up when departments and offerings are loading
 */
export function OfferingListHolder() {
  return (
    <div className="offering-list" role="list">
      {['offering-list-holder1', 'offering-list-holder2'].map( key =>
        <div className="section" role="listitem" key={key}>
          <Placeholder style={{height: '2rem'}}>
            <Placeholder.Line length='long' />
          </Placeholder>
          <div className="offerings">
            {['off1', 'off2', 'off3', 'off4', 'off5', 'off6'].map( itemKey => 
              <OfferingCardHolder key={key+itemKey} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}