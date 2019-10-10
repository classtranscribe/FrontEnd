/**
 * Offering List Component lists all accessible offerings for a user
 * - offerings are organized by departments
 */

import React from 'react'
// UI
import { OfferingListHolder, ReloadContents } from './PlaceHolder'
import Section from './Section'
// Vars
import { handleData } from 'utils'

export default function SectionList({ state, props, displaySearchHeader, getOfferingsByStudent, ...functions }) {
  const { departments, departSelected, termSelected, offerings } = state
  if (offerings[0] === 'Unloaded') return <OfferingListHolder />
  if (!departments.length || offerings[0] === 'retry') return <ReloadContents onRetry={getOfferingsByStudent} />

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

  const sections = ['history', ...departments]
  const onFilter = departSelected.length > 0 || termSelected.length > 0
  // sections.

  return (
    <div className="offering-list" role="list">
      {/* Starred */}
      {
        !onFilter
        &&
        <Section 
          {...functions}
          type="starred" 
          state={state} 
        />
      }
      {/* History */}

      {/* Offerings */}
      {sections.map( section => 
        section === 'history' ? 
          onFilter ? null :
          <Section
            {...functions}
            key='history-section'
            type="history" 
            state={state} 
            watchHistory={props.watchHistory}
          />
        :
        (section && nonEmptyDepart.includes(section.id)) ? 
          <Section 
            {...functions}
            key={section.id} 
            type="department"
            state={state} 
            depart={section} 
            displaySearchHeader={displaySearchHeader}
          />
        : 
        null)}
    </div>
  )
}
