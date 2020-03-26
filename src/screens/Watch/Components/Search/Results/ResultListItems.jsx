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

  let mediaId = item.media ? item.media.id : item.mediaId
  let mediaName = item.media ? item.media.mediaName : item.mediaName
  let begin = item.caption ? item.caption.begin : item.begin
  let text = item.caption ? item.caption.text : item.text

  const handleClick = () => {
    if (option === SEARCH_TRANS_IN_VIDEO) {
      videoControl.currTime(timeStrToSec(begin))
    } else if (option === SEARCH_TRANS_IN_COURSE) {
      window.location = util.links.watch(mediaId, { begin: timeStrToSec(begin) })
    }
  }

  return (
    <button 
      role="listitem" 
      className="plain-btn search-result-listitem"
      onClick={handleClick}
    >
      <div className="search-result-time">{prettierTimeStr(begin)}</div>
      <p className="search-result-text" kind={item.kind}>
        {item.kind === WEBVTT_DESCRIPTIONS && <span className="text-muted">{'(Description)'}<br/></span>}
        <span className="search-result-content" dangerouslySetInnerHTML={{__html: text}}></span>
        {
          option === SEARCH_TRANS_IN_COURSE
          &&
          <span className="search-result-media-name">{item.playlistName}<br/>{mediaName}<br/></span>
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
  const { mediaId, name, playlistName } = media
  const mediaHistory = watchHistory.filter(mh => mh.mediaId === mediaId)[0] || {}
  const { ratio, timeStamp } = mediaHistory
  return (
    <div role="listitem"  className="watch-video-item search-result-listitem search-result-videos">
      <VideoCard row dark
        id={mediaId}
        name={name}
        ratio={ratio}
        posterSize={'100px'}
        listitem={false}
        fittedNameSize={-1}
        description={`Playlist - ${playlistName}`}
        link={util.links.watch(mediaId, { begin: timeStamp })}
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