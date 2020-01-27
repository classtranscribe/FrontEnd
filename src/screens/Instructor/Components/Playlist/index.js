import _ from 'lodash'
import React, { useEffect, useState, useRef } from 'react'
import { connectWithRedux } from '_redux/instructor'
import { withRouter } from 'react-router'

import { Filter } from '../Filter'
import { PlaceHolder } from '../Placeholder'

import PlaylistInfo from './PlaylistInfo'
import ButtonBar from './ButtonBar'
import Video from './Video'

import NoPlaylistHolder from './NoPlaylistHolder'
import NoVideoHolder from './NoVideoHolder'

import NewPlaylist from './NewPlaylist'
import Analytics from './Analytics'
import UploadVideo from './UploadVideo'

import {  
  filterControl, 
  NEW_PLAYLIST, OFF_ANALYSIS, 
  NEW_OFFERING, HIDE_PLAYLIST, NO_PLAYLIST, NO_OFFERING_ID,
} from '../../Utils'
import './index.css'


function PlaylistWithRedux({
  playlist={},
  offering={},
  isEditingOffering=false,
}) {

  let newOffering = offering === NEW_OFFERING
  let noPlaylist = playlist === NO_PLAYLIST
  let canShowPlaylists = Boolean(playlist.id) && (playlist !== OFF_ANALYSIS && playlist !== NEW_PLAYLIST)

  const [results, setResults] = useState([])

  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (canShowPlaylists) {
      setResults(playlist.medias || [])
      if (isUploading) setIsUploading(false)
    }
  }, [playlist])

  const onOpenUpload = () => setIsUploading(true)
  const onCloseUpload = () => setIsUploading(false)

  const onFilter = value => filterControl.filterMedias(value, playlist.medias, setResults)
  const onReverse = () => filterControl.reverse(results, setResults)

  if (isEditingOffering) return null
  if (!offering.id) return null
  if (newOffering || playlist === HIDE_PLAYLIST) return null
  
  if (noPlaylist) return <NoPlaylistHolder />
  if (playlist === NEW_PLAYLIST) return <NewPlaylist offeringId={offering.id} />
  if (playlist === OFF_ANALYSIS) return <Analytics />
  if (isUploading) return <UploadVideo playlist={playlist} onClose={onCloseUpload} />
  

  return (
    <div className="ip-playlist-con">
      {
        canShowPlaylists ?
        <div className="w-100 h-auto ct-a-fade-in">
          <PlaylistInfo playlist={playlist} />

          {/* Title */}
          <div className="ip-sb-title ct-d-r-center-v mt-3">
            <i className="material-icons" aria-hidden="true">video_library</i>
            <h3>VIDEOS</h3>
          </div>
          
          {/* Filter */}
          <div className="w-100">
            {
              playlist.sourceType === 2
              &&
              <button 
                className="plain-btn ip-sb-off-item" 
                onClick={onOpenUpload}
              >
                <div tabIndex="-1" className="ip-sb-off-item-con">
                  <span className="ct-d-r-center-v ip-sb-off-text ip-c-pl-name ip-sb-off-num">
                    <i className="material-icons" aria-hidden="true">arrow_upward</i> UPLOAD VIDEOS
                  </span>
                </div>
              </button>
            }

            <Filter //darker
              searchFor="Videos" 
              onFilter={onFilter} 
              onReverse={onReverse} 
            />
          </div>

          {/* Buttons */}
          <ButtonBar results={results} />
          
          {/* Videos */}
          {
            results.length === 0
            ?
            <NoVideoHolder type={playlist.sourceType} />
            :
            <div className="ct-list-col ip-videos">
              {results.map( me => (
                <Video 
                  key={me.id} 
                  media={me} 
                  courseNumber={offering.courseNumber}
                />
              ))}
            </div>
          }
          

          {/* <ClassTranscribeFooter /> */}
        </div>
        :
        <PlaceHolder />
      }
    </div>
  )
}

export const Playlist = withRouter(connectWithRedux(
  PlaylistWithRedux,
  [
    'offering',
    'playlist',
    'isEditingOffering'
  ],
  []
))