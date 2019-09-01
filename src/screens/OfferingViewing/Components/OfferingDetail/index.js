/**
 * Offering detail screen for a offering
 * - contains offering info and playlists
 */

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
// UI
import { Icon, Divider } from 'semantic-ui-react'
import { ClassTranscribeFooter } from 'components'
import Playlists from './Playlists'
// Vars
import { api, util, handleData, user } from 'utils'
import './index.css'

export function OfferingDetail({id, history, location}) {
  const [offering, setOffering] = useState(null)
  const [playlists, setPlaylists] = useState(null)
  // variables to present
  const [fullNumber, setFullNumber] = useState('Loading...')
  const [termName, setTermName] = useState('')
  const [sectionName, setSectionName] = useState('')
  const [description, setDescription] = useState('')
  const [courseName, setCourseName] = useState('Loading...')

  const checkAccessType = accessType => {
    if (accessType !== 0 && !user.isLoggedIn()) user.login() 
  }

  /**
   * Get all offerings and complete offerings
   */
  useEffect(() => {
    const propsState = history.location.state
    if (propsState && propsState.fullCourse) {
      const { fullCourse } = propsState
      checkAccessType(fullCourse.accessType)
      setFullNumber(() => fullCourse.fullNumber)
      setTermName(() => fullCourse.termName)
      setDescription(() => fullCourse.description)
      setSectionName(() => fullCourse.section)
      setCourseName(() => fullCourse.courseName)
    } else {
      api.getOfferingById(id)
        .then( ({data}) => {
          checkAccessType(data.offering.accessType)
          api.completeSingleOffering(data, function(data) {
            setOffering(() => data)
          })
        })
    }
    api.getPlaylistsByOfferingId(id) 
      .then( ({data}) => {
        // console.log('playlists', data)
        setPlaylists(() => data)
      })
    api.sendUserAction('selectcourse', {
      offeringId: id
    })
  }, [id])


  /**
   * Set up variables after offerings loaded
   */
  useEffect(() => {
    if (!offering) return;
    if (offering.courses) {
      const number = api.getFullNumber(offering.courses)
      if (handleData.isValidCourseNumber(number)) {
        setFullNumber(() => number)
        setCourseName(() => offering.courses[0].courseName)
        setDescription(() => offering.courses[0].description)
      }
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
      <div className="offering-info">
        <div className="goback-container">
          <Link 
            className="del-icon" 
            to={{
              pathname: pathname, 
              state: { id: elemId, value: location.state.searchedValue },
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
      </div>
      
      <div className="playlist-container">
        <Divider />
        <h4>Playlists</h4>
        <Playlists 
          offeringId={id}
          history={history} 
          playlists={playlists} 
          fullNumber={fullNumber}  
        />
        <ClassTranscribeFooter />
      </div>
    </div>
  )
}