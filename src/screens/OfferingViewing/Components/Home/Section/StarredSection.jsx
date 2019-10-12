import React from 'react'
import OfferingCard from './OfferingCard'
import { OfferingListHolder } from '../PlaceHolder'

export default function StarredSection({ offerings, starredOfferings, showAll, starOffering, unstarOffering, state }) {
  if (starredOfferings[0] === 'unloaded') return <OfferingListHolder row={1} image={false} />
  return (
    <div className={`offerings ${showAll ? 'offerings-show-all' : ''}`} id="starred-offerings">
      {starredOfferings.map( offeringId =>  (
        <OfferingCard 
          {...state}
          key={'starred' + offeringId} 
          offering={offerings.filter(offering => offering.id === offeringId)[0]}
          starOffering={starOffering} 
          unstarOffering={unstarOffering} 
          starredOfferings={starredOfferings}
        />
      ))}
    </div>
  )
}