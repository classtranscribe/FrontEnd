import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
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

function Section({ history, depart={}, state={}, watchHistory, type, ...functions }) {
  var { offerings, universities, starredOfferings } = state
  const uni = universities.length ? handleData.findById(universities, depart.universityId) : ''

  const [showAll, setShowAll] = useState(false)
  const handleShowAll = () => {
    if (type === 'history') {
      history.push(util.links.history())
    } else {
      setShowAll(showAll => !showAll)
    }
  }
  const [isFolded, setisFolded] = useState(false)
  const handleFold = () => {
    setisFolded(isFolded => !isFolded)
  }

  if (type === 'department') offerings =  offerings.filter( offering => isThisSection(offering, depart.id))
  if (type === 'starred' && !starredOfferings.length) return null 
  if (type === 'history' && !watchHistory.length) return null

  const sectionTitle = type === 'department' ? 
                          { title: depart.name, subtitle: uni.name} :
                       type === 'starred' ?
                          { title: <><Icon name="bookmark" /> Starred Courses</>, subtitle: ''} :
                       type === 'history' ?
                          { title: <><Icon name="history" /> Continue Watching</>, subtitle: ''} : {}

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
            state={state}
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
