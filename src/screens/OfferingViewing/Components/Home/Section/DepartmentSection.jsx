import React from 'react'
// UI
import { OfferingCardHolder } from '../PlaceHolder'
import OfferingCard from './OfferingCard'


export default function DepartmentSection({ offerings, depart, showAll, state }) {

  const getKey = (offering, index) => depart.id + (offering.id || offering.offering.id) + index
  return (
    <div className={`offerings ${showAll ? 'offerings-show-all' : ''}`}>
      {offerings.map( (offering, index) => 
        offering.courses ? 
        <OfferingCard image
          {...state}
          key={getKey(offering, index)}
          depart={depart}  
          offering={offering} 
        />
        : 
        <OfferingCardHolder key={getKey(offering, index)} />
      )}
    </div>
  )
}

