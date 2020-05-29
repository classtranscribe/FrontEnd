/**
 * Placeholders for Home screen
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { Placeholder, Icon } from 'semantic-ui-react';
import { links } from 'utils/links';

/**
 * Placeholder shows up when a offering is loading
 */
export function OfferingCardHolder({ image = true, width = '16rem' }) {
  return (
    <div className="offering-card-container">
      <Card className="offeringCard" id="offering-card-holder">
        <Placeholder>
          <Placeholder.Image style={{ height: '9rem', width }} />
        </Placeholder>

        {image && (
          <Card.Body>
            <Placeholder>
              <Placeholder.Header>
                <Placeholder.Line length="long" />
                <Placeholder.Line length="short" />
              </Placeholder.Header>
            </Placeholder>
          </Card.Body>
        )}
      </Card>

      {!image && (
        <>
          <br />
          <br />
        </>
      )}
    </div>
  );
}

/**
 * Placeholder shows up when departments and offerings are loading
 */
export function OfferingListHolder({ noCourse, row = 2, image = true, title = true, width }) {
  if (row === 1)
    return (
      <div className="section" role="listitem">
        {title && (
          <Placeholder style={{ height: '2rem' }}>
            <Placeholder.Line length="long" />
          </Placeholder>
        )}
        <div className="offerings">
          {['off1', 'off2', 'off3', 'off4', 'off5', 'off6'].map((itemKey) => (
            <OfferingCardHolder key={itemKey} image={image} width={width} />
          ))}
        </div>
      </div>
    );

  return noCourse ? (
    <div className="w-100 d-flex align-items-center text-muted m-5">NO COURSE</div>
  ) : (
    <div className="offering-list" role="list" style={{ overflowX: 'hidden' }}>
      <hr />
      {['offering-list-holder1', 'offering-list-holder2'].map((key) => (
        <div className="section" role="listitem" key={key}>
          <Placeholder style={{ height: '2rem' }}>
            <Placeholder.Line length="long" />
          </Placeholder>
          <div className="offerings">
            {['off1', 'off2', 'off3', 'off4', 'off5', 'off6'].map((itemKey) => (
              <OfferingCardHolder key={key + itemKey} width={width} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ReloadContents({ onRetry }) {
  return (
    <div className="reload-prompt d-flex justify-content-center align-items-center w-100 m-5">
      Could not load courses. &ensp;
      <Link to={links.home()} onClick={onRetry}>
        Retry
        <Icon name="redo" />
      </Link>
    </div>
  );
}
