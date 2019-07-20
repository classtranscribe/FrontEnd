/**
 * Offering detail screen for a offering
 * - contains offering info and playlists
 */

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
// UI
import { Icon, Divider } from 'semantic-ui-react'
import { ClassTranscribeFooter } from '../../../../components'
// Vars
import { api, util } from '../../../../util'
import './index.css'

export function OfferingDetail({id, history}) {
  const [offering, setOffering] = useState(null)
  // variables to present
  const [fullNumber, setFullNumber] = useState('')
  const [termName, setTermName] = useState('')
  const [sectionName, setSectionName] = useState('')
  const [description, setDescription] = useState('')
  const [courseName, setCourseName] = useState('')

  /**
   * Get all offerings and complete offerings
   */
  useEffect(() => {
    api.getOfferingById(id)
      .then( ({data}) => {
        api.completeSingleOffering(data, function(data) {
          setOffering(() => data)
          // console.log(data)
        })
      })
  }, [id])

  /**
   * Set up variables after offerings loaded
   */
  useEffect(() => {
    if (!offering) return;
    if (offering.courses) {
      setFullNumber(() => api.getFullNumber(offering.courses))
      setCourseName(() => offering.courses[0].courseName)
      setDescription(() => offering.courses[0].description)
    }
    if (offering.offering && offering.offering.termName) {
      setTermName(() => offering.offering.termName)
      setSectionName(() => offering.offering.sectionName)
    }
  })
  
  /**
   * Determine which page to go back
   */
  var elemId = ''
  var pathname = util.links.home()
  if (history.location.state) {
    elemId = history.location.state.hash
    if (history.location.state.from === 'search') {
      pathname = util.links.search()
    }
  }

  // const allLoaded = fullNumber && termName && courseName && description && sectionName

  return (
    <div className="offering-detail" >
      <div className="goback-container">
        <Link 
          className="del-icon" 
          to={{
            pathname: pathname, 
            state: {id: elemId},
          }}
        >
          <Icon name="chevron left" /> Go Back
        </Link>
      </div>

      <h1>{fullNumber}</h1><br/><br/>
      <h2>
        {courseName}&emsp;
        <span>{termName}&ensp;{sectionName}</span>
      </h2><br/>
      <h5>{description}</h5><br/><br/>
      <Divider />
      <h4>Playlists</h4>
      
      <ClassTranscribeFooter />
    </div>
  )
}