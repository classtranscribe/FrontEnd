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
import { handleData, api, util } from '../../../../util'
import './index.css'

export function OfferingDetail({offerings, id, history}) {
  const [offering, setOffering] = useState(null)
  const [fullNumber, setFullNumber] = useState('')
  const [termName, setTermName] = useState('')
  const [sectionName, setSectionName] = useState('')
  const [description, setDescription] = useState('')
  const [courseName, setCourseName] = useState('')

  useEffect(() => {
    const fullOffering = handleData.findById(offerings, id)
    if (fullOffering) {
      setOffering(() => fullOffering)
    }
  }, [offerings, id])

  useEffect(() => {
    if (!offering) return;
    if (offering === 'NOT FOUND') {
      if (window.location.pathname.includes('offering')) {
        console.log('I am here', window.location.pathname)
        // window.location = util.links.home()
      }
    } else if (offering.courses) {
      setFullNumber(() => api.getFullNumber(offering.courses))
      setDescription(() => offering.courses[0].description)
      setCourseName(() => offering.courses[0].courseName)
    } else if (offering.offering) {
      setTermName(() => offering.offering.termName)
      setSectionName(() => offering.offering.sectionName)
    }
  }, [offering])
  
  var elemId = ''
  var pathname = util.links.home()
  if (history.location.state) {
    elemId = history.location.state.hash
    if (history.location.state.from === 'search') {
      pathname = util.links.search()
    }
  }

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