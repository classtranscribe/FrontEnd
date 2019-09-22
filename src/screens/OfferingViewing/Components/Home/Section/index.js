import React, { useState } from 'react'
// UI
import { Button } from 'semantic-ui-react'
import DepartmentSection from './DepartmentSection'
import StarredSection from './StarredSection'
import './index.css'
// Vars
import { handleData, util } from 'utils'

function isThisSection(offering, departmentId) {
  if (handleData.find(offering.courses, { departmentId })) return true
  return false
}

export default function Section({ depart={}, state={}, type }) {
  var { offerings, universities } = state
  const uni = universities.length ? handleData.findById(universities, depart.universityId) : ''

  const [showAll, setShowAll] = useState(false)
  const handleShowAll = () => setShowAll(showAll => !showAll)

  offerings = type === 'department' ? 
              offerings.filter( offering => isThisSection(offering, depart.id)) :
              type === 'starred' ?
              util.getStarredOfferingsArray() : []

  const sectionTitle = type === 'department' ? 
                        { title: depart.name, subtitle: uni.name} :
                       type === 'starred' ?
                        { title: 'Starred Courses', subtitle: ''} : {}

  if (offerings.length === 0) return null
  return (
    <div className="section" id={depart.acronym}>
      <hr/>
      <h2 className="title">
        {sectionTitle.title} <span>{sectionTitle.subtitle}</span>
      </h2>
      {
        type === 'department' ?
          <DepartmentSection  
            state={state}
            depart={depart}
            showAll={showAll}
            offerings={offerings}
          /> 
        :
        type === 'starred' ?
          <StarredSection 
            showAll={showAll}
            offerings={offerings}  
          /> 
        : 
        null
      }
      {offerings.length > 6 && <Button id="offering-show-all-btn" compact onClick={handleShowAll} content={showAll ? 'Collapse' : 'Show More'} />}
    </div>
  ) 
}
