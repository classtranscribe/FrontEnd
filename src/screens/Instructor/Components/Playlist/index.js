import _ from 'lodash'
import React, { useEffect, useState, createRef } from 'react'
import { Sticky } from 'semantic-ui-react'

import { Filter } from '../Filter'
import { PlaceHolder } from '../../../../components'

import PlaylistInfo from './PlaylistInfo'
import ButtonBar from './ButtonBar'
import VideoItem from './VideoItem'
import MediaDetail from './MediaDetail'

// import NoPlaylistHolder from './NoPlaylistHolder'
import NoVideoHolder from './NoVideoHolder'

import NewPlaylist from './NewPlaylist'
import UploadVideo from './UploadVideo'

import {  
  connectWithRedux, 
  filterControl, 
  NEW_PLAYLIST, OFF_ANALYSIS, 
  NEW_OFFERING, HIDE_PLAYLIST, NO_PLAYLIST, OFF_SETTINGS, plControl, //NO_OFFERING_ID,
} from '../../Utils'
import './index.scss'
import { util } from 'utils'


function PlaylistWithRedux({
  offering={},
  playlist={},
  playlists=[],
  isEditingOffering=false,
  isViewingAnalytics=false,
}) {

  // Determine the context
  let newOffering = offering === NEW_OFFERING
  let offSettings = playlist === OFF_SETTINGS
  let noPlaylist = playlist === NO_PLAYLIST
  let canShowPlaylists = Boolean(playlist.id) && (playlists.length > 0 && offering.id)
                      && (playlist !== OFF_ANALYSIS && playlist !== NEW_PLAYLIST)

  // Media results to display
  const [results, setResults] = useState([])
  const onFilter = value => filterControl.filterMedias(value, playlist.medias, setResults)
  const onReverse = () => filterControl.reverse(results, setResults)

  // Determine whether to display upload screen
  const [isUploading, setIsUploading] = useState(false)
  const onOpenUpload = () => setIsUploading(true)
  const onCloseUpload = () => setIsUploading(false)

  // Current selected media
  const [currMedia, setCurrMedia] = useState('')
  const openMedia = me => () => {
    util.links.pushSearch({ mid: me.id })
    setCurrMedia(me)
  }
  const closeMedia = () => {
    util.links.pushSearch({ mid: undefined })
    setCurrMedia({})
  }

  // The context of the playlist component
  const stickyContextRef = createRef()
  const [isTop, setIsTop] = useState(true)

  // filter
  const [filtering, setFiltering] = useState(false)

  // Update results when playlist changes
  useEffect(() => {
    if (canShowPlaylists) {
      setResults(playlist.medias || [])
      if (isUploading) setIsUploading(false)
    }
    if (currMedia.id) closeMedia()

    // if mid is specified in the url
    let { mid } = util.links.useSearch()
    if (mid && playlist.medias && playlist.medias.length > 0) {
      let requestMedia = _.find(playlist.medias, { id: mid })
      if (requestMedia) {
        openMedia(requestMedia)()
      } else { // if the mid is incorrect, remove mid from url
        util.links.pushSearch({ mid: null })
      }
    }
  }, [playlist])

  // Conditions not display playlist
  if (isEditingOffering || isViewingAnalytics) return null
  if (!offering.id) return null
  if (newOffering || offSettings || playlist === HIDE_PLAYLIST) return null
  
  // Special contexts
  // if (noPlaylist) return <NoPlaylistHolder />
  if (playlist === NEW_PLAYLIST || noPlaylist) return <NewPlaylist offeringId={offering.id} noPlaylist={noPlaylist} />
  if (isUploading) return <UploadVideo playlist={playlist} onClose={onCloseUpload} />

  return (
    <div ref={stickyContextRef} className="ip-playlist">
      {
        canShowPlaylists ?
        <div className="ct-a-fade-in ip-playlist-con" data-scroll>
          {/* Playlist Info */}
          <Sticky pushing
            offset={55}
            context={stickyContextRef}  
            onStick={() => setIsTop(false)} 
            onUnstick={() => setIsTop(true)}
          >
            <PlaylistInfo playlist={playlist} isTop={isTop} />
          </Sticky>

          <div className="ip-pl-detail ct-d-c">
            {
              playlist.createdAt
              &&
              <div>
                <span>Created at {playlist.createdAt.slice(0,10)}</span>
              </div>
            }
            {
              plControl.getPlaylistSourceURL(playlist)
              &&
              <div>
                <b>SOURCE</b>
                <span className="pl-2">{plControl.getPlaylistSourceURL(playlist)}</span>
              </div>
            }
          </div>

          {/* Title */}
          <div className="ip-sb-title ct-d-r-center-v mt-3" style={{background: 'transparent'}}>
            <i className="material-icons" aria-hidden="true">video_library</i>
            <h3>VIDEOS</h3>
          </div>

          {/* Selecting Buttons */}
          <ButtonBar 
            results={results} 
            filtering={filtering}
            setFiltering={setFiltering} 
            upload={playlist.sourceType === 2}
            onOpenUpload={onOpenUpload}
          />

          {
            (playlist.medias.length > 0 && filtering)
            &&
            <div className="w-100 ct-a-fade-in mb-2">
              <Filter //darker
                searchFor="Videos" 
                onFilter={onFilter} 
                onReverse={onReverse} 
              />
            </div>
          }
          
          {/* Video Items */}
          {
            playlist.medias.length === 0
            ?
            <NoVideoHolder type={playlist.sourceType} />
            :
            <div className="ct-list-col ip-videos">
              {results.map( me => (
                <VideoItem 
                  key={me.id} 
                  media={me} 
                  current={me.id === currMedia.id}
                  openMedia={openMedia}
                  courseNumber={offering.courseNumber}
                />
              ))}
            </div>
          }
        </div>
        :
        <PlaceHolder />
      }

      {
        currMedia.id 
        && 
        <MediaDetail media={currMedia} onClose={closeMedia} />
      }
    </div>
  )
}

export const Playlist = connectWithRedux(
  PlaylistWithRedux,
  [
    'offering',
    'playlist',
    'playlists',
    'isEditingOffering',
    'isViewingAnalytics'
  ],
  []
)