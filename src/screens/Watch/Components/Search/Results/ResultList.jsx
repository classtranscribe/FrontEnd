import React from 'react'
import _ from 'lodash'
import { Popup } from 'semantic-ui-react'
import { VideoCard } from 'components'
import { 
  // searchControl,
  videoControl,
  timeStrToSec, 
  prettierTimeStr,
  SEARCH_INIT, 
  WEBVTT_DESCRIPTIONS, 
  SEARCH_TRANS_IN_VIDEO, 
  SEARCH_TRANS_IN_COURSE,
  SEARCH_IN_PLAYLISTS,
  searchControl,
  ARRAY_INIT,
} from '../../../Utils'
import { util } from 'utils'

function ResultList({
  option=SEARCH_TRANS_IN_VIDEO,
  search=SEARCH_INIT,
}) {
  const { 
    inVideoTransResults, 
    inCourseTransResults, 
    playlistResults,
    value
  } = search

  const results = option === SEARCH_TRANS_IN_VIDEO ? inVideoTransResults 
                : option === SEARCH_TRANS_IN_COURSE ? inCourseTransResults 
                : playlistResults

  const popupContent = item => {
    if (option === SEARCH_TRANS_IN_VIDEO) {
      return `Seek to this ${item.kind === WEBVTT_DESCRIPTIONS ? 'description' : 'caption'}`
    } else if (option === SEARCH_TRANS_IN_COURSE) {
      return `Watch this caption in video ${item.media.mediaName}`
    } else {
      return <>Watch video {item.mediaName}</>
    }
  }

  const handleClick = item => () => {
    if (option === SEARCH_TRANS_IN_VIDEO) {
      videoControl.currTime(timeStrToSec(item.begin))
    } else if (option === SEARCH_TRANS_IN_COURSE) {
      console.log('?')
      const { courseNumber } = util.parseSearchQuery()
      window.location = util.links.watch(courseNumber, item.media.id, item.begin)
    } else {
      const { courseNumber } = util.parseSearchQuery()
      window.location = util.links.watch(courseNumber, item.id)
    }
  }

  return (
    <div role="list" className="search-result-list">
      {
        results === ARRAY_INIT ?
        <div className="search-result-term">0 result(s) for '{value}'</div>
        :
        <>
          {value && <div className="search-result-term">{results.length} result(s) for '{value}'</div>}
          {results.map( (item, index) => (
            <Popup inverted wide basic
              position="top left"
              openOnTriggerClick={false}
              openOnTriggerFocus
              closeOnTriggerBlur
              key={`search-result-#${index}`}
              content={popupContent(item)}
              trigger={
                option === SEARCH_IN_PLAYLISTS ? 
                <Video media={item} />
                :
                <button 
                  role="listitem" 
                  className="plain-btn search-result-listitem"
                  onClick={handleClick(item)}
                >
                  <div className="search-result-time">{prettierTimeStr(item.begin)}</div>
                  <p className="search-result-text" kind={item.kind}>
                    {item.kind === WEBVTT_DESCRIPTIONS && <span className="text-muted">(Description)<br/></span>}
                    <span className="search-result-content" dangerouslySetInnerHTML={{__html: item.text}}></span>
                    {
                      option === SEARCH_TRANS_IN_COURSE
                      &&
                      <span className="search-result-media-name">{item.playlistName}<br/>{item.media.mediaName}<br/></span>
                    }
                  </p>
                </button>
              }
            />
          ))}
        </>
      }
    </div>
  )
}

function Video({ 
  media=null, 
  watchHistory=[],
}) {
  const courseNumber = util.parseURLFullNumber()
  const { id, mediaName, playlistName } = media
  const mediaHistory = watchHistory.filter(mh => mh.mediaId === id)[0] || {}
  const { ratio, timeStamp } = mediaHistory
  return (
    <div className="watch-video-item search-result-listitem search-result-videos">
      <VideoCard row dark
        id={id}
        name={mediaName}
        ratio={ratio}
        posterSize={'100px'}
        fittedNameSize={-1}
        description={`Playlist - ${playlistName}`}
        //mediaState={{ media, playlist, playlists }}
        //handleLinkClick={() => window.location.search = util.createSearchQuery({ courseNumber, id, timeStamp })}
        handleLinkClick={() => util.refresh()}
        link={util.links.watch(courseNumber, id, timeStamp)}
      />
    </div>
  )
}

export default ResultList