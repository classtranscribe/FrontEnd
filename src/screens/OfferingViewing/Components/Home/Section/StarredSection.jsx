import React from 'react'
import OfferingCard from './OfferingCard'
// import { util } from 'utils'

export default function StarredSection({ offerings, showAll, starOffering, unstarOffering }) {
  return (
    <div className={`offerings ${showAll ? 'offerings-show-all' : ''}`} id="starred-offerings">
      {offerings.map( fullCourse => fullCourse.id ? (
        <OfferingCard 
          key={fullCourse.id} 
          fullCourse={fullCourse} 
          starOffering={starOffering} 
          unstarOffering={unstarOffering} 
        />
      ) : null)}
    </div>
  )
}