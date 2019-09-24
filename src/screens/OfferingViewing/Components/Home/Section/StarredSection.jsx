import React from 'react'
import OfferingCard from './OfferingCard'

export default function StarredSection({ offerings, starredOfferings, showAll, starOffering, unstarOffering, state }) {
  return (
    <div className={`offerings ${showAll ? 'offerings-show-all' : ''}`} id="starred-offerings">
      {starredOfferings.map( offeringId =>  (
        <OfferingCard 
          {...state}
          key={'starred' + offeringId} 
          offering={offerings.filter(offering => offering.id === offeringId)[0]}
          starOffering={starOffering} 
          unstarOffering={unstarOffering} 
        />
      ))}
    </div>
  )
}