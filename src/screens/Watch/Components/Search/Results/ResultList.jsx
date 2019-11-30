import React from 'react'
import _ from 'lodash'
import { Popup } from 'semantic-ui-react'
import { VideoCard } from 'components'
import Placeholder from '../Placeholder'
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
  ARRAY_INIT,
} from '../../../Utils'
import { util } from 'utils'

function ResultList({
  option=SEARCH_TRANS_IN_VIDEO,
  search=SEARCH_INIT,
  page=1,
  nextPage=null,
  prevPage=null,
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
      window.location = util.links.watch(courseNumber, item.media.id, timeStrToSec(item.begin))
    } else {
      const { courseNumber } = util.parseSearchQuery()
      window.location = util.links.watch(courseNumber, item.id)
    }
  }

  const totalPage = results.length === 0 ? 1 : Math.ceil(results.length / 20)

  return (
    <div role="list" className="search-result-list">
      {
        results === ARRAY_INIT ?
        <Placeholder />
        :
        <>
          {
            value 
            && 
            <div className="w-100 d-flex align-content-center justify-content-between search-result-bar">
              <div className="search-result-term">{results.length} result(s) for '{value}'</div>
              <div className="position-relative d-flex align-content-center justify-content-center">
                <div className="p-1 mx-1">Page {page}/{totalPage}</div>
                <div>
                  <button
                    className="plain-btn watch-search-btn page-btn"
                    disabled={page === 1}
                    onClick={prevPage}
                  >
                    <span tabIndex="-1"><i className="material-icons">chevron_left</i></span>
                  </button>
                  <button
                    className="plain-btn watch-search-btn page-btn"
                    disabled={page === totalPage}
                    onClick={nextPage}
                  >
                    <span tabIndex="-1"><i className="material-icons">chevron_right</i></span>
                  </button>
                </div>
              </div>
            </div>
          }
          <div className="w-100 d-flex flex-column">
            {results.map( (item, index) => ((index < page * 20) && (index >= (page-1)*20)) ? (
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
            ) : null)}
          </div>
        </>
      }
      {
        results.length > 20
        &&
        <div className="w-100 mt-1 d-flex align-content-center justify-content-end search-result-bar">
          <div className="position-relative d-flex align-content-center justify-content-center">
            <div className="p-1 mx-1">Page {page}/{totalPage}</div>
            <div>
              <button
                className="plain-btn watch-search-btn page-btn"
                disabled={page === 1}
                onClick={prevPage}
              >
                <span tabIndex="-1"><i className="material-icons">chevron_left</i></span>
              </button>
              <button
                className="plain-btn watch-search-btn page-btn"
                disabled={page === totalPage}
                onClick={nextPage}
              >
                <span tabIndex="-1"><i className="material-icons">chevron_right</i></span>
              </button>
            </div>
          </div>
        </div>
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