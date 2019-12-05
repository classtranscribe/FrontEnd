import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'
// UI
import { Icon } from 'semantic-ui-react'
import { SectionShowMoreButton, SectionFoldButton } from './Overlays'
import DepartmentSection from './DepartmentSection'
import StarredSection from './StarredSection'
import HistorySection from './HistorySection'
import './index.css'
// Vars
import { handleData, util } from 'utils'

function isThisSection(offering, departmentId) {
  if (handleData.find(offering.courses, { departmentId })) return true
  return false
}

function Section({ history, depart={}, state, offerings=[], starredOfferings=[], watchHistory=[], type, ...functions }) {
  const { universities } = state
  const uni = _.find(universities, { id: depart.universityId }) || {}

  const [showAll, setShowAll] = useState(false)
  const [isFolded, setisFolded] = useState(false)

  // Functions handling states' changes
  const handleShowAll = () => {
    if (type === 'history') {
      history.push(util.links.history())
    } else {
      setShowAll(showAll => !showAll)
    }
  }

  const handleFold = () => {
    setisFolded(isFolded => !isFolded)
  }

  // Determine the section's type
  let sectionTitle = {}
  if (type === 'department') {
    offerings =  offerings.filter( offering => offering.departmentIds.includes(depart.id) )
    if (offerings.length === 0) return null
    sectionTitle = { title: depart.name, subtitle: uni.name}

  } else if (type === 'starred') {
    if (!starredOfferings.length) return null 
    sectionTitle = { title: <><Icon name="bookmark" /> Starred Courses</>, subtitle: ''} 
    
  } else if (type === 'history') {
    if (watchHistory.length < 5) return null
    sectionTitle = { title: <><Icon name="history" /> Continue Watching</>, subtitle: ''}
  }

  return (
    <div className="section" id={depart.acronym} role="listitem">
      <hr/>
      <h2 className="title">
        {sectionTitle.title} <span>{sectionTitle.subtitle}</span>
      </h2>
      {
        isFolded ? null :
        type === 'department' ?
          <DepartmentSection 
            {...functions} 
            state={{...state, offerings}}
            depart={depart}
            showAll={showAll}
            offerings={offerings}
            starredOfferings={starredOfferings}
          /> 
        :
        type === 'starred' ?
          <StarredSection 
            {...functions}
            state={{...state, offerings}}
            showAll={showAll}
            offerings={offerings}
            starredOfferings={starredOfferings}
          /> 
        : 
        type === 'history' ?
          <HistorySection
            watchHistory={watchHistory}
            offerings={offerings}
          />
        :
        null
      }
      {/* Overlay Buttons */}
      <SectionShowMoreButton 
        shouldDisplay={(type === 'starred' ? starredOfferings.length > 6 : offerings.length > 6) && !isFolded} 
        showAll={showAll} 
        handleShowAll={handleShowAll} 
      />
      <SectionFoldButton 
        shouldDisplay 
        isFolded={isFolded} 
        handleFold={handleFold} 
      />
    </div>
  ) 
}

export default withRouter(Section)
