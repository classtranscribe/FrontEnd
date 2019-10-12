/**
 * Offering detail screen for a offering
 * - contains offering info and playlists
 */

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
// UI
import { Icon, Button } from 'semantic-ui-react'
import Playlists from './Playlists'
// Vars
import { api, util, handleData, user } from 'utils'
import './index.css'

export function OfferingDetail({ id, history, location, state, starOffering, unstarOffering }) {
  const { starredOfferingsJSON={}, watchHistoryJSON } = state
  const [offering, setOffering] = useState(null)
  const [playlists, setPlaylists] = useState(null)
  // variables to present
  const [fullNumber, setFullNumber] = useState('Loading...')
  // const [courseNumber, setCourseNumber] = useState('Loading...')
  const [termName, setTermName] = useState('')
  const [sectionName, setSectionName] = useState('')
  const [description, setDescription] = useState('')
  const [courseName, setCourseName] = useState('Loading...')

  const [isStarred, setIsStarred] = useState(Boolean(starredOfferingsJSON[id]))
  useEffect(() => {
    setIsStarred(Boolean(starredOfferingsJSON[id]))
  }, [starredOfferingsJSON])

  const handleStar = () => {
    if (isStarred) unstarOffering(id)
    else starOffering(id)
    setIsStarred(isStarred => !isStarred)
  }

  const checkAccessType = accessType => {
    if (accessType !== 0 && !user.isLoggedIn()) user.login() 
  }

  /**
   * Get all offerings and complete offerings
   */
  useEffect(() => {
    util.scrollToTop('.sp-content')

    const propsState = history.location.state
    if (propsState && propsState.fullCourse) {
      const { fullCourse } = propsState
      checkAccessType(fullCourse.accessType)
      setFullNumber(() => fullCourse.fullNumber)
      // setCourseNumber(() => fullCourse.courseNumber)
      setTermName(() => fullCourse.termName)
      setDescription(() => fullCourse.description)
      setSectionName(() => fullCourse.section)
      setCourseName(() => fullCourse.courseName)
      util.links.title(fullCourse.fullNumber+' • '+fullCourse.termName+' • '+fullCourse.section)
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
      .catch( () => {
        setPlaylists(['need-signin'])
      })
    api.sendUserAction('selectcourse', {
      offeringId: id
    })
  }, [id, history])


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
    util.links.title(fullNumber+' '+termName+' '+sectionName)
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
  const iconName = isStarred ? 'star' : 'star outline'
  const buttonName = isStarred ? 'UNSTAR' : 'STAR'

  return (
    <div className="offering-detail" >
      {/* Offering Info */}
      <div className="offering-info">
        <div className="goback-container">
          <Link 
            className="del-icon" 
            to={{
              pathname: pathname, 
              state: { id: elemId, value: location.state ? location.state.searchedValue : '' },
            }}
          >
            <Icon name="chevron left" /> Go Back
          </Link>
        </div>
        
        <h1>{fullNumber}</h1>
        <br/><br/>
        <h2>
          {courseName}&emsp;
          <span>{termName}&ensp;{sectionName}</span>
        </h2><br/>
        {description && <><p className="offering-description">{description}</p><br/><br/></>}
        {
          user.isLoggedIn()
          &&
          <Button compact icon labelPosition='left' id={`${isStarred ? 'starred' : 'unstarred'}`} onClick={handleStar}>
            <Icon name={iconName} />
            {buttonName}
          </Button>
        }
      </div>
      
      {/* Playlists */}
      <Playlists 
        offeringId={id}
        history={history} 
        playlists={playlists} 
        fullNumber={fullNumber}  
        watchHistoryJSON={watchHistoryJSON}
      />
    </div>
  )
}