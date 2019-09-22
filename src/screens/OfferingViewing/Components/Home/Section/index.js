import React, { useState } from 'react'
// UI
import { Button, Icon } from 'semantic-ui-react'
import DepartmentSection from './DepartmentSection'
import StarredSection from './StarredSection'
import './index.css'
// Vars
import { handleData, util } from 'utils'

function isThisSection(offering, departmentId) {
  if (handleData.find(offering.courses, { departmentId })) return true
  return false
}

export default function Section({ depart={}, state={}, type, ...functions }) {
  var { offerings, universities, starredOfferings } = state
  const uni = universities.length ? handleData.findById(universities, depart.universityId) : ''

  const [showAll, setShowAll] = useState(false)
  const handleShowAll = () => setShowAll(showAll => !showAll)
  const [isClosed, setIsClosed] = useState(false/*!util.isStarredSectionOpen()*/)
  const closeStarredSection = () => {
    if (isClosed) util.openStarredSection()
    else util.closeStarredSection()
    setIsClosed(isClosed => !isClosed)
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
  // if (type === 'starred' && isClosed) return null

  return (
    <div className="section" id={depart.acronym}>
      <hr/>
      <h2 className="title">
        {sectionTitle.title} <span>{sectionTitle.subtitle}</span>
      </h2>
      {
        isClosed ? null :
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
      {
        (offerings.length > 6 && !isClosed)
        && 
        <Button id="offering-show-all-btn" compact onClick={handleShowAll} title={showAll ? 'Collapse' : 'Show More'} aria-label={showAll ? 'Collapse' : 'Show More'}>
          <span tabindex="-1">
            {showAll ? 'Collapse' : 'Show More'}
          </span>
        </Button>
      }
      {
        <Button id="offering-close-btn" compact onClick={closeStarredSection} title={isClosed ? 'Open' : 'Close'} aria-label={isClosed ? 'Open' : 'Close'}>
          <span tabindex="-1">
            {isClosed ? <i class="material-icons">expand_more</i> : <i class="material-icons">close</i>} 
          </span>
        </Button>
      }
    </div>
  ) 
}
