import React, { useEffect, useState } from 'react'
import { connectWithRedux } from '_redux/instructor'
import { withRouter } from 'react-router'
import './index.css'
import { 
  setup,
  plControl,
  offControl,
  filterControl, 
  ARRAY_EMPTY, NEW_OFFERING, NO_PLAYLIST,
} from '../../Utils'
import { PlaceHolder } from '../Placeholder'
import { EditCourse } from '../EditCourse'
import CourseInfo from './CourseInfo'
import Playlists from './Playlists'

function CourseWithRedux({
  offering={},
  playlists=[],
  playlist={},

  isEditingOffering=false,
  setIsEditingOffering,

  history
}) {

  const [results, setResults] = useState([])

  useEffect(() => {
    if (offering.id && !playlists.length) {
      if (offering === NEW_OFFERING) return;
      setup.setUpPlaylists(offering.id)
    }
  }, [offering])

  useEffect(() => {
    if (playlists.length > 0) {
      if (playlists === ARRAY_EMPTY) {
        handlePlaylistClick(NO_PLAYLIST)()
      } else {
        handlePlaylistClick(playlists[0])()
      }
      setResults(playlists)
    }
  }, [playlists])

  const handleDelete = () => {
    setup.confirm({
      text: <span>Are you sure to delete the course <br/><strong><i>{offering.courseName}</i></strong>?</span>,
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

  const onFilter = value => filterControl.filterPlaylists(value, playlists, setResults)
  const onReverse = () => filterControl.reverse(results, setResults)


  if (offering === NEW_OFFERING) return <EditCourse newCourse />
  if (isEditingOffering) return <EditCourse />

  return (
    <div className="ip-course">
      {
        Boolean(offering.id && playlists.length > 0) ? <>
        <div className="ct-a-fade-in w-100 h-auto">
          {/* Course Info */}
          <CourseInfo 
            offering={offering}
            playlist={playlist}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handlePlaylistClick={handlePlaylistClick}
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
    'isEditingOffering'
  ],
  [
    'setIsEditingOffering'
  ]
))