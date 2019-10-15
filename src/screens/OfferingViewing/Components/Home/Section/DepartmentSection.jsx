import React from 'react'
// UI
import { OfferingCardHolder } from '../PlaceHolder'
import OfferingCard from './OfferingCard'


export default function DepartmentSection({ offerings, starredOfferings, depart, showAll, state, ...functions }) {

  const getKey = (offering, index) => depart.id + (offering.id || offering.offering.id) + index
  return (
    <div className={`offerings ${showAll ? 'offerings-show-all' : ''}`}>
      {offerings.map( (offering, index) => 
        offering.fullNumber ? 
        <OfferingCard image
          {...state}
          {...functions}
          key={getKey(offering, index)}
          depart={depart}  
          offering={offering} 
          starredOfferings={starredOfferings}
        />
        : 
        <OfferingCardHolder key={getKey(offering, index)} />
      )}
    </div>
  )
}

