import React, { useState } from 'react'
import OfferingCard from './OfferingCard'
// import { util } from 'utils'

export default function StarredSection({ offerings, showAll }) {
  return (
    <div className={`offerings ${showAll ? 'offerings-show-all' : ''}`}>
      {offerings.map( fullCourse => fullCourse.id ? (
        <OfferingCard key={fullCourse.id} fullCourse={fullCourse} />
      ) : null)}
    </div>
  )
}