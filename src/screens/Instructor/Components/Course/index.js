import React, { useEffect, useState } from 'react'
import { connectWithRedux } from '_redux/instructor'
import { withRouter } from 'react-router'
import { CTButton } from 'components'
import './index.css'
import { Filter } from '../Filter'
import { 
  setUpPlaylists, 
  filterControl, 
  NEW_PLAYLIST, NEW_OFFERING, OFF_ANALYSIS, HIDE_PLAYLIST
} from '../../Utils'
import { PlaceHolder } from '../Placeholder'
import { PlaylistIcon } from '../PlaylistIcon'
import { EditCourse } from '../EditCourse'

function CourseWithRedux({
  offering={},
  playlists=[],
  playlist={},

  setPlaylists,
  setPlaylist,

  history
}) {

  useEffect(() => {
    if (offering.id && !playlists.length) {
      if (offering === NEW_OFFERING) return;
      setUpPlaylists(offering.id, setPlaylists)
    }
  }, [offering])

  const handlePlaylistClick = pl => () => {
    if (Boolean(pl.medias)) {
      pl.medias = pl.medias.slice().reverse()
    }
    setPlaylist(pl)
  }

  const [results, setResults] = useState([])
  const [editCourse, setEditCourse] = useState(false)

  const onEdit = () => {
    setEditCourse(true)
    setPlaylist(HIDE_PLAYLIST)
  }
  const onClose = () => {
    setEditCourse(false)
    if (playlists.length > 0) {
      handlePlaylistClick(playlists[0])()
      setResults(playlists)
    }
  }

  useEffect(() => {
    if (playlists.length > 0) {
      handlePlaylistClick(playlists[0])()
      setResults(playlists)
    }
  }, [playlists])


  const onFilter = value => filterControl.filterPlaylists(value, playlists, setResults)
  const onReverse = () => filterControl.reverse(results, setResults)


  if (offering === NEW_OFFERING) return <EditCourse newCourse />
  if (editCourse) return <EditCourse onClose={onClose} />

  return (
    <div className="ip-course">
      {
        Boolean(offering.id && playlists.length > 0) ? <>
        <div className="ct-a-fade-in w-100 h-auto">
          {/* Course Info */}
            <div className="ip-course-info">
              <h2 className="ip-c-num">{offering.courseNumber}</h2>
              <div className="ip-c-name">{offering.courseName}</div>
              <div className="ip-c-detail">
                {offering.term.name} | {offering.sectionName}
              </div>
              <div className="ip-c-descrip">
                {offering.description}
              </div>

              <div className="ip-c-btns-con ct-btn-group">
                <CTButton
                  text="Edit Course"
                  icon="edit"
                  color="green"
                  onClick={onEdit}
                />
                <CTButton
                  icon="delete"
                  color="light"
                  popup="Delete Course"
                  //popupDelay={500}
                />
              </div>
            </div>

            <div className="w-100 mb-3">
              <button 
                className="plain-btn ip-sb-off-item ip-c-pl-item" 
                data-current={playlist === OFF_ANALYSIS}
                onClick={handlePlaylistClick(OFF_ANALYSIS)}
              >
                <div tabIndex="-1" className="ip-sb-off-item-con ip-c-pl-item-con">
                  <span className="ct-d-r-center-v ip-sb-off-text ip-c-pl-name ip-sb-off-num">
                    <i className="material-icons" aria-hidden="true">bar_chart</i> COURSE ANALYSIS
                  </span>
                  <span className="ip-c-pl-r-icon" data-small>
                    <i className="material-icons">chevron_right</i>
                  </span>
                </div>
              </button>
            </div>

          {/* Title & Filter */}
            <div className="ip-c-title">

              <div className="ip-sb-title ct-d-r-center-v">
                <i className="material-icons" aria-hidden="true">list_alt</i>
                <h3>PLAYLISTS</h3>
              </div>

              <button 
                className="plain-btn ip-sb-off-item ip-c-pl-item" 
                data-current={playlist === NEW_PLAYLIST}
                onClick={handlePlaylistClick(NEW_PLAYLIST)}
              >
                <div tabIndex="-1" className="ip-sb-off-item-con ip-c-pl-item-con">
                  <span className="ct-d-r-center-v ip-sb-off-text ip-c-pl-name ip-sb-off-num">
                   {/* <Icon name="add" /> */}
                   <i className="material-icons" aria-hidden="true">add</i> NEW PLAYLIST
                  </span>
                  <span className="ip-c-pl-r-icon" data-small>
                    <i className="material-icons">chevron_right</i>
                  </span>
                </div>
              </button>

              <Filter darker
                searchFor="Playlists"
                onFilter={onFilter}
                onReverse={onReverse}
              />
            </div>

          {/* Playlists */}
          <div className="ct-list-col ip-c-playlists">
            {results.map( pl => (
              <div key={pl.id} className="w-100">
                <button 
                  className="plain-btn ip-sb-off-item ip-c-pl-item" 
                  data-current={Boolean(playlist.id === pl.id)}
                  onClick={handlePlaylistClick(pl)}
                >
                  <div tabIndex="-1" className="ip-sb-off-item-con ip-c-pl-item-con">
                    <span className="ip-sb-off-text ip-c-pl-name ip-sb-off-num">
                      <PlaylistIcon type={pl.sourceType} /> {pl.name}
                    </span>
                    <span className="ip-sb-off-text ip-c-pl-mnum">
                      {pl.medias.length} video(s)
                    </span>
                    <span className="ip-c-pl-r-icon">
                      <i className="material-icons" aria-hidden="true">chevron_right</i>
                    </span>
                  </div> 
                </button>
              </div>
            ))}
          </div>
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
  ['offering', 'playlists', 'playlist'],
  ['setPlaylists', 'setPlaylist']
))