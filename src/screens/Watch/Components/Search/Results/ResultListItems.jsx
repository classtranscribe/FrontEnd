import React from 'react'
import { VideoCard } from '../../../../../components'
import { ShortcutKey } from '../../Menus/ShortcutsTable'
import { util } from '../../../../../utils'
import { 
  videoControl,
  timeStrToSec, 
  prettierTimeStr,
  WEBVTT_DESCRIPTIONS, 
  SEARCH_TRANS_IN_VIDEO, 
  SEARCH_TRANS_IN_COURSE,
} from '../../../Utils'


/**
 * The result listitem for Captions
 */
export const CaptionListItem = ({
  item,
  option,
}) => {

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

  return (
    <button 
      role="listitem" 
      className="plain-btn search-result-listitem"
      onClick={handleClick(item)}
    >
      <div className="search-result-time">{prettierTimeStr(item.begin)}</div>
      <p className="search-result-text" kind={item.kind}>
        {item.kind === WEBVTT_DESCRIPTIONS && <span className="text-muted">{'(Description)'}<br/></span>}
        <span className="search-result-content" dangerouslySetInnerHTML={{__html: item.text}}></span>
        {
          option === SEARCH_TRANS_IN_COURSE
          &&
          <span className="search-result-media-name">{item.playlistName}<br/>{item.media.mediaName}<br/></span>
        }
      </p>
    </button>
  )
}

/**
 * The result listitem for videos
 */
export const VideoListItem = ({ 
  media=null, 
  watchHistory=[],
}) => {
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
        link={util.links.watch(courseNumber, id, timeStamp)}
      />
    </div>
  )
}

/**
 * The result listitem for shortcuts
 */
export const ShortcutListItem = ({
  row
}) => {
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