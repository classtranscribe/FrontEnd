import React from 'react';
import { CTFragment } from 'layout';
import { connectWithRedux } from '../../controllers';

export function OfferingListWithRedux({
  offerings
}) {
  const loading = offerings.length === 0;
  
  return (
    <CTFragment padding={[0, 35, 0, 35]} list loading={loading}>
      {
        offerings.map(offering => (
          <div>{offering.offering.courseName}</div>
        ))
      }
    </CTFragment>
  )
}

export const OfferingList = connectWithRedux(
  OfferingListWithRedux,
  ['offerings'],
  []
)