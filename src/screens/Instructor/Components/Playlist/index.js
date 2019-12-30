import _ from 'lodash'
import React, { useEffect, useState, useRef } from 'react'
import { connectWithRedux } from '_redux/instructor'
import { withRouter } from 'react-router'
import { CTButton, ClassTranscribeFooter } from 'components'
import './index.css'
import { Filter } from '../Filter'
import { PlaceHolder } from '../Placeholder'
import { PlaylistIcon } from '../PlaylistIcon'
import Video from './Video'
import {  
  filterControl, 
  NEW_PLAYLIST, OFF_ANALYSIS, NEW_OFFERING, HIDE_PLAYLIST
} from '../../Utils'


function PlaylistWithRedux({
  playlist={},
  playlists=[],
  offering={},
}) {

  let newOffering = offering === NEW_OFFERING
  let canShowPlaylists = Boolean(playlist.id) && (playlist !== OFF_ANALYSIS && playlist !== NEW_PLAYLIST)

  const [results, setResults] = useState([])
  const [editPlName, setEditPl] = useState('')
  const [isSelect, setIsSelect] = useState(false)
  const [selectedMedias, setSelectedMedias] = useState({})
  const plnameRef = useRef()

  useEffect(() => {
    if (canShowPlaylists) {
      setResults(playlist.medias || [])
      setSelectedMedias({})
      if (isSelect) setIsSelect(false)
      if (Boolean(editPlName)) setEditPl('')
    }
  }, [playlist])

  const handleOpenSelect = () => {
    if ( isSelect ) setSelectedMedias({})
    setIsSelect( !isSelect )
  }
  const handleDeleteVideos = () => {

  }

  const handleSelect = me => {
    setSelectedMedias({ ...selectedMedias, [me.id]: me })
  }
  const handleRemove = me => {
    if (Boolean(selectedMedias[me.id])) {
      delete selectedMedias[me.id]
      setSelectedMedias({ ...selectedMedias })
    }
  }

  const selectedAll = results.length === Object.keys(selectedMedias).length
  const handleSelectAll = () => {
    if (selectedAll) {
      setSelectedMedias({})
    } else {
      _.forEach(results, re => {
        selectedMedias[re.id] = re
      })
      setSelectedMedias({ ...selectedMedias })
    }
  }

  const handleEditPlName = () => setEditPl( Boolean(editPlName) ? '' : playlist.name )
  const handlePlNameChange = ({ target: { value } }) => setEditPl(value)

  useEffect(() => {
    if (editPlName) plnameRef.current.focus()
  }, [editPlName])

  const onFilter = value => filterControl.filterMedias(value, playlist.medias, setResults)
  const onReverse = () => filterControl.reverse(results, setResults)

  if (newOffering || playlist === HIDE_PLAYLIST) return null
  if (playlist === NEW_PLAYLIST) return null
  if (playlist === OFF_ANALYSIS) return null

  return (
    <div className="ip-playlist-con ct-a-fade-in">
      {
        canShowPlaylists ?
        <div className="w-100 h-auto ct-a-fade-in">
          <div className="ip-p-title ct-d-r-center-v">
            {
              Boolean(editPlName) ?
              <div className="ip-p-pl-name-edit ct-a-fade-in">
                <div className="ip-p-pl-name-edit-con ip-filter-con">
                  <input 
                    ref={plnameRef}
                    value={editPlName}
                    className="ip-filter-input" 
                    onChange={handlePlNameChange}
                  />
                </div>
              </div>
              :
              <h3 className="ip-p-pl-name ct-d-r-center-v">
                <PlaylistIcon type={playlist.sourceType} size="large" /> <span>{playlist.name}</span>
              </h3>
            }
            <CTButton
              icon={Boolean(editPlName) ? undefined : "edit"}
              text={Boolean(editPlName) ? "Save" : undefined}
              size="normal bold"
              color={Boolean(editPlName) ? "text-green" : "light"}
              onClick={handleEditPlName}
            />
          </div>

          {/* Title */}
          <div className="ip-sb-title ct-d-r-center-v mt-3">
            <i className="material-icons" aria-hidden="true">video_library</i>
            <h3>VIDEOS</h3>
          </div>
          
          {/* Filter */}
          <div className="w-100">
            <Filter //darker
              searchFor="Videos" 
              onFilter={onFilter} 
              onReverse={onReverse} 
            />
          </div>

          {/* Buttons */}
          <div className="w-100 ip-p-btns">
            <div className="w-100 ct-btn-group ct-d-r-center-v ip-p-btns-con">
            {
              isSelect
              ?
              <div className="ct-btn-group ct-d-r-center-v">
                <CTButton
                  size="normal bold"
                  icon={selectedAll ? "close" : "check"}
                  color="yellow"
                  text={selectedAll ? "Remove All" : "Select All"}
                  onClick={handleSelectAll}
                />
                <CTButton
                  size="normal bold"
                  icon="delete"
                  color="red"
                  text="Delete"
                  disabled={Object.keys(selectedMedias).length === 0}
                  onClick={handleDeleteVideos}
                />
                <CTButton
                  size="normal bold"
                  text="Cancel"
                  onClick={handleOpenSelect}
                />
              </div>
              :
              <div className="ct-btn-group ct-d-r-center-v">
                <CTButton
                  size="normal bold"
                  text="Upload"
                  icon="cloud_upload"
                  color="green"
                />
                <CTButton
                  size="normal bold"
                  text="Select"
                  onClick={handleOpenSelect}
                />
              </div>
            }
            </div>
          </div>
          
          {/* Videos */}
          <div className="ct-list-col ip-videos">
            {results.map( me => (
              <Video 
                key={me.id} 
                media={me} 
                courseNumber={offering.courseNumber}
                isSelect={isSelect}
                selectedMedias={selectedMedias}
                handleSelect={handleSelect}
                handleRemove={handleRemove}
              />
            ))}
          </div>

          <ClassTranscribeFooter />
        </div>
        :
        <PlaceHolder />
      }
    </div>
  )
}

export const Playlist = withRouter(connectWithRedux(
  PlaylistWithRedux,
  ['playlist', 'playlists', 'offering'],
  []
))