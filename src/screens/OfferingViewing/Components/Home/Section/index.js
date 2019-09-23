import React, { useState } from 'react'
// UI
import { Icon } from 'semantic-ui-react'
import { SectionShowMoreButton, SectionFoldButton } from './Overlays'
import DepartmentSection from './DepartmentSection'
import StarredSection from './StarredSection'
import './index.css'
// Vars
import { handleData } from 'utils'

function isThisSection(offering, departmentId) {
  if (handleData.find(offering.courses, { departmentId })) return true
  return false
}

export default function Section({ depart={}, state={}, type, ...functions }) {
  var { offerings, universities, starredOfferings } = state
  const uni = universities.length ? handleData.findById(universities, depart.universityId) : ''

  const [showAll, setShowAll] = useState(false)
  const handleShowAll = () => setShowAll(showAll => !showAll)
  const [isFolded, setisFolded] = useState(false)
  const handleFold = () => {
    setisFolded(isFolded => !isFolded)
  }

  offerings = type === 'department' ? 
              offerings.filter( offering => isThisSection(offering, depart.id)) :
              type === 'starred' ?
              starredOfferings : []

  const sectionTitle = type === 'department' ? 
                        { title: depart.name, subtitle: uni.name} :
                       type === 'starred' ?
                        { title: <><Icon name="bookmark" /> Starred Courses</>, subtitle: ''} : {}

  if (offerings.length === 0) return null
  // if (type === 'starred' && isFolded) return null

  return (
    <div className="section" id={depart.acronym}>
      <hr/>
      <h2 className="title">
        {sectionTitle.title} <span>{sectionTitle.subtitle}</span>
      </h2>
      {
        isFolded ? null :
        type === 'department' ?
          <DepartmentSection 
            {...functions} 
            state={state}
            depart={depart}
            showAll={showAll}
            offerings={offerings}
          /> 
        :
        type === 'starred' ?
          <StarredSection 
            {...functions}
            showAll={showAll}
            offerings={offerings}
          /> 
        : 
        null
      }
      {/* Overlay Buttons */}
      <SectionShowMoreButton shouldDisplay={offerings.length > 6 && !isFolded} showAll={showAll} handleShowAll={handleShowAll} />
      <SectionFoldButton shouldDisplay isFolded={isFolded} handleFold={handleFold} />
    </div>
  ) 
}
