import React, { useEffect, useState } from 'react'
import { connectWithRedux } from '_redux/instructor'
import { withRouter } from 'react-router'
import './index.css'
import { 
  setup,
  offControl,
  filterControl, 
  ARRAY_EMPTY, NEW_OFFERING, NO_PLAYLIST, NO_OFFERING_ID, NEW_PLAYLIST,
} from '../../Utils'
import { util } from 'utils'
import _ from 'lodash'

import { PlaceHolder } from '../Placeholder'
import { EditCourse } from '../EditCourse'

import CourseInfo from './CourseInfo'
import Playlists from './Playlists'
import Analytics from './Analytics'
import NoOfferingHolder from './NoOfferingHolder'

function CourseWithRedux({
  offering={},
  playlists=[],
  playlist={},

  isEditingOffering=false,
  setIsEditingOffering,

  isViewingAnalytics=false,
  setIsViewingAnalytics,

  location
}) {

  const [results, setResults] = useState([])

  const handleDelete = () => {
    setup.confirm({
      text: <div>Are you sure to delete the course <span>{offering.courseName}</span> ?</div>,
      onConfirm: () => offControl.deleteOffering(offering.id)
    })
  }

  const handlePlaylistClick = pl => () => {
    setup.changePlaylist(pl)
  }

  const handleEdit = () => {
    offControl.offering(offering)
    setIsEditingOffering(true)
  }

  const viewAnalytics = () => {
    setIsViewingAnalytics(true)
  }

  const onFilter = value => filterControl.filterPlaylists(value, playlists, setResults)
  const onReverse = () => filterControl.reverse(results, setResults)


  useEffect(() => {
    if (offering.courseNumber) {
      if (offering === NEW_OFFERING) return;
      setup.setUpPlaylists(offering.id)
    }
  }, [offering])

  useEffect(() => {
    setup.setupPlaylist(handlePlaylistClick, setResults)
  }, [playlists])

  useEffect(() => {
    if (results.length > 0) {
      setup.playlistToView(location.hash.replace('#pid=', ''))
    }
  }, [results])


  if (!offering.id) return <NoOfferingHolder />
  if (offering === NEW_OFFERING) return <EditCourse newCourse />
  if (isEditingOffering) return <EditCourse />
  if (isViewingAnalytics) return <Analytics />

  return (
    <div className="ip-course">
      {
        Boolean(offering.id && playlists.length > 0) ? <>
        <div className="ct-a-fade-in w-100 h-auto">
          {/* Course Info */}
          <CourseInfo 
            offering={offering}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            viewAnalytics={viewAnalytics}
          />

          <Playlists
            results={results}
            playlist={playlist}
            onFilter={onFilter}
            onReverse={onReverse}
            handlePlaylistClick={handlePlaylistClick}
          />
        </div>


        {/* Placeholder */}
        </> : <>
          <div className="ip-c-placeholder">
            <PlaceHolder />
          </div>
        </>
      }
      
    </div>
  )
}

export const Course = withRouter(connectWithRedux(
  CourseWithRedux,
  [
    'offering', 
    'playlists', 
    'playlist',
    'isEditingOffering',
    'isViewingAnalytics'
  ],
  [
    'setIsEditingOffering',
    'setIsViewingAnalytics'
  ]
))