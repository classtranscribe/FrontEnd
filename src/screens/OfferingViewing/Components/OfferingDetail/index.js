/**
 * Offering detail screen for a offering
 * - contains offering info and playlists
 */

import React, { useEffect, useState } from 'react'
import { Link, useLocation, useHistory, useParams } from 'react-router-dom'
// UI
import { Icon } from 'semantic-ui-react'
import Playlists from './Playlists'
// Vars
import { Button } from 'pico-ui'
import { useCTContext, PlaceHolder } from '../../../../components'
import { api, util, user } from '../../../../utils'
import './index.css'

export function OfferingDetail({ 
  state, 
  starOffering, 
  unstarOffering 
}) {
  const history = useHistory()
  const location = useLocation()
  const { id } = useParams()
  const { generalError } = useCTContext()

  const { starredOfferingsJSON, watchHistoryJSON } = state
  const [offering, setOffering] = useState({})
  const [playlists, setPlaylists] = useState(null)
  const [isStarred, setIsStarred] = useState(Boolean(starredOfferingsJSON[id]))

  const handleStar = () => {
    if (isStarred) unstarOffering(id)
    else starOffering(id)
    setIsStarred(isStarred => !isStarred)
  }

  const getOffering = async () => {
    let parsedOffering = {}

    const propsState = history.location.state
    if (propsState && propsState.offering) {
      parsedOffering = propsState.offering
    } else {
      try {
        let { data } = await api.getOfferingById(id)
        parsedOffering = api.parseSingleOffering(data)
      } catch (error) {
        if (api.isAuthError(error)) {
          setPlaylists(['need-signin'])
          return 401
        } else {
          generalError({ header: "Couldn't load the offering." })
          return 500
        }
      }
    }

    setOffering(parsedOffering)
    // console.log('parsedOffering', parsedOffering)
    util.links.title(
      parsedOffering.fullNumber
      +' | '+parsedOffering.termName
      +' | '+parsedOffering.sectionName)

    return 200
  }

  const getPlaylists = async () => {
    try {
      let { data } = await api.getPlaylistsByOfferingId(id) 
      setPlaylists(data)
    } catch (error) {
      if (api.isAuthError(error)) {
        setPlaylists(['need-signin'])
      } else {
        setPlaylists([])
        generalError({ header: "Couldn't load the playlists." })
      }
    }
  }

  const setupOfferingDetails = async () => {
    let status = await getOffering()
    if (status === 200) {
      await getPlaylists()
      await api.sendUserAction('selectcourse', { offeringId: id })
    }
  }

  /**
   * Get all offerings and complete offerings
   */
  useEffect(() => {
    util.scrollToTop('.sp-content')
    setupOfferingDetails()
  }, [id])

  useEffect(() => {
    setIsStarred(Boolean(starredOfferingsJSON[id]))
  }, [starredOfferingsJSON])

  
  /**
   * Determine which page to go back
   */
  var pathname = util.links.home()
  if (history.location.state) {
    const { from } = history.location.state
    if (from === 'search') {
      pathname = util.links.search()
    } else if (from === 'history') {
      pathname = util.links.history()
    }
  }

  return Boolean(offering.id) ? (
    <div className="offering-detail ct-a-fade-in" >
      {/* Offering Info */}
      <div className="offering-info">
        <div className="goback-container">
          <Link 
            className="del-icon" 
            to={{
              pathname: pathname, 
              state: { value: location.state ? location.state.searchedValue : '' },
            }}
          >
            <Icon name="chevron left" /> Go Back
          </Link>
        </div>
        
        <h1 className="od-course-number">{offering.fullNumber}</h1>

        <h2 className="od-course-name">
          {offering.courseName}
        </h2>

        <div className="od-course-txt">
          {offering.termName} | {offering.sectionName}
        </div>

        {/* {
          offering.instructor 
          && 
          <div className="od-course-inst">{offering.instructor.fullName}</div>
        } */}

        {
          offering.description 
          && 
          <p className="offering-description">{offering.description}</p>
        }
        <br/>
        {
          user.isLoggedIn()
          &&
          <Button uppercase
            id="off-star-btn"
            color={isStarred ? "" : "teal"}
            icon={isStarred ? 'star' : 'star_border'}
            text={isStarred ? 'unstar' : 'star'}
            onClick={handleStar}
          />
        }
      </div>
      
      {/* Playlists */}
      <Playlists 
        offeringId={id}
        accessType={offering.accessType}
        history={history} 
        playlists={playlists} 
        fullNumber={offering.fullNumber}  
        watchHistoryJSON={watchHistoryJSON}
      />
    </div>
  ) : <PlaceHolder />
}