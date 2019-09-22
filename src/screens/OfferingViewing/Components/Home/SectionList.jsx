/**
 * Offering List Component lists all accessible offerings for a user
 * - offerings are organized by departments
 */

import React from 'react'
// UI
import { OfferingListHolder } from './PlaceHolder'
import Section from './Section'
// Vars
import { handleData } from 'utils'

export default function SectionList({ state, displaySearchHeader }) {
  const { departments, departSelected, termSelected, offerings } = state
  if (!departments.length || offerings[0] === 'Unloaded' || (offerings[0] && !offerings[0].courses)) return <OfferingListHolder />

  function notEmpty(depart) {
    for (let i = 0; i < offerings.length; i++) {
      const hasOfferings = handleData.find(offerings[i].courses, {departmentId: depart.id})
      const hasTerm = !termSelected.length || termSelected.includes(offerings[i].offering.termId)
      if (hasOfferings && hasTerm) return true
    }
    return false
  }

  var nonEmptyDepart = []
  for (var i = 0; i < departments.length; i++) {
    if ((!departSelected.length || departSelected.includes(departments[i].id)) && (notEmpty(departments[i]))) {
      nonEmptyDepart.push(departments[i].id)
    }
  }

  if (nonEmptyDepart.length === 0) return <OfferingListHolder noCourse />

  return (
    <div className="offering-list" role="list">
      <Section type="starred" state={state} />
      {departments.map( depart => nonEmptyDepart.includes(depart.id) ? (
        <Section 
          key={depart.id} 
          type="department"
          state={state} 
          depart={depart} 
          displaySearchHeader={displaySearchHeader}
        />
      ) : null)}
    </div>
  )
}
