import React from 'react'
import _ from 'lodash'
import { Popup } from 'semantic-ui-react'
import { VideoCard } from 'components'
import Placeholder from '../Placeholder'
import { ShortcutKey } from '../../Menus/ShortcutsTable'
import { 
  menuControl,
  searchControl,
  videoControl,
  timeStrToSec, 
  prettierTimeStr,
  SEARCH_INIT, 
  WEBVTT_DESCRIPTIONS, 
  SEARCH_TRANS_IN_VIDEO, 
  SEARCH_TRANS_IN_COURSE,
  SEARCH_IN_PLAYLISTS,
  ARRAY_INIT,
  SEARCH_IN_SHORTCUTS,
  MENU_SHORTCUTS,
  MENU_PLAYLISTS,
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
    shortcutResults,
    value
  } = search

  const results = option === SEARCH_TRANS_IN_VIDEO ? inVideoTransResults 
                : option === SEARCH_TRANS_IN_COURSE ? inCourseTransResults 
                : option === SEARCH_IN_SHORTCUTS ? shortcutResults
                : playlistResults

  const popupContent = item => {
    if (option === SEARCH_TRANS_IN_VIDEO) {
      return `Seek to this ${item.kind === WEBVTT_DESCRIPTIONS ? 'description' : 'caption'}`
    } else if (option === SEARCH_TRANS_IN_COURSE) {
      return <>Watch this caption in video <i>{item.media.mediaName}</i></>
    } else if (option === SEARCH_IN_SHORTCUTS) {
      return undefined
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

  const totalPage = searchControl.totalPageNum(results.length)

  return (
    <div className="search-result-list">
      {
        results === ARRAY_INIT ?
        <Placeholder />
        :
        <>
          { // Buttons for page turning
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

          {
            option === SEARCH_IN_SHORTCUTS 
            && 
            <div className="w-100 d-flex px-3">
              <button
                className="plain-btn watch-search-btn page-btn"
                aria-label="See all shortcuts"
                aria-controls="watch-shortcuts-table-container"
                aria-haspopup="true"
                onClick={() => menuControl.open(MENU_SHORTCUTS)}
              >
                <span className="py-2 px-4 my-1 fsize-1-3" tabIndex="-1">See all shortcuts</span>
              </button>
            </div>
          }

          {
            option === SEARCH_IN_PLAYLISTS 
            && 
            <div className="w-100 d-flex px-3">
              <button
                className="plain-btn watch-search-btn page-btn"
                aria-label="See all videos"
                aria-controls="watch-playlists-menu"
                aria-haspopup="true"
                onClick={() => menuControl.open(MENU_PLAYLISTS)}
              >
                <span className="py-2 px-4 my-1 fsize-1-3" tabIndex="-1">See all playlists</span>
              </button>
            </div>
          }

          {/* The Result list */}
          <div role="list" className="w-100 d-flex flex-column">
            {results.map( (item, index) => searchControl.isInCurrentPage(page, index) ? (
              <Popup inverted wide basic hideOnScroll 
                position="top left"
                openOnTriggerClick={false}
                openOnTriggerFocus
                closeOnTriggerBlur
                disabled={option === SEARCH_IN_SHORTCUTS}
                key={`search-result-#${index}`}
                content={popupContent(item)}
                trigger={
                  option === SEARCH_IN_PLAYLISTS ? // Video results are special
                  <Video media={item} />
                  :
                  option === SEARCH_IN_SHORTCUTS ?
                  <Shortcut key={item.action} row={item} />
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

      { // Buttons for page turning
        totalPage > 1
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
    <div role="listitem"  className="watch-video-item search-result-listitem search-result-videos">
      <VideoCard row dark
        id={id}
        name={mediaName}
        ratio={ratio}
        posterSize={'100px'}
        listitem={false}
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

function Shortcut({
  row
}) {
  return (
    <div role="listitem" className="d-flex w-100 justify-content-between search-shortcut-item">
      <div className="shortcuts-des">{row.action}</div>
      <div className="shortcuts-key" light="true">
        {row.keys.map( (key, index) => (
          <ShortcutKey skey={key} key={`${row.action}-${index}`} index={index} />
        ))}
      </div>
    </div>
  )
}

export default ResultList