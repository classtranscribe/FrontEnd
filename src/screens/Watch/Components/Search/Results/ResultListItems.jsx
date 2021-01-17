import React from 'react';
import { MediaCard } from 'components';
import { links } from 'utils/links';
import { connect } from 'dva';
import {
  timeStrToSec,
  prettierTimeStr,
  WEBVTT_DESCRIPTIONS,
  SEARCH_TRANS_IN_VIDEO,
  SEARCH_TRANS_IN_COURSE,
} from '../../../Utils';
import { ShortcutKey } from '../../Menus/ShortcutsTable';

/**
 * The result listitem for Captions
 */
const CaptionListItemWithRedux = ({ item, option, dispatch }) => {
  let mediaId = item.media ? item.media.id : item.mediaId;
  let mediaName = item.media ? item.media.mediaName : item.mediaName;
  let begin = item.caption ? item.caption.begin : item.begin;
  let text = item.caption ? item.caption.text : item.text;

  const handleClick = () => {
    if (option === SEARCH_TRANS_IN_VIDEO) {
      dispatch({ type: 'watch/media_setCurrTime', payload: timeStrToSec(begin) })
    } else if (option === SEARCH_TRANS_IN_COURSE) {
      window.location = links.watch(mediaId, { begin: timeStrToSec(begin) });
    }
  };

  return (
    <button role="listitem" className="plain-btn search-result-listitem" onClick={handleClick}>
      <div className="search-result-time">{prettierTimeStr(begin)}</div>
      <p className="search-result-text" kind={item.kind}>
        {item.kind === WEBVTT_DESCRIPTIONS && (
          <span className="text-muted">
            (Description)
            <br />
          </span>
        )}

        <span className="search-result-content" dangerouslySetInnerHTML={{ __html: text }} />

        {option === SEARCH_TRANS_IN_COURSE && (
          <span className="search-result-media-name">
            {item.playlistName}
            <br />
            {mediaName}
            <br />
          </span>
        )}
      </p>
    </button>
  );
};
export const CaptionListItem = connect()(CaptionListItemWithRedux);

/**
 * The result listitem for videos
 */
export const VideoListItem = ({ media = null }) => {
  const { mediaId, name, playlistName } = media;
  return (
    <MediaCard
      row
      dark
      id={mediaId}
      name={name}
      href={"video?id=" + mediaId}
      description={`Playlist - ${playlistName}`}
      posterSize="small"
    />
  );
};

/**
 * The result listitem for shortcuts
 */
export const ShortcutListItem = ({ row }) => {
  return (
    <div role="listitem" className="d-flex w-100 justify-content-between search-shortcut-item">
      <div className="shortcuts-des">{row.action}</div>
      <div className="shortcuts-key" light="true">
        {row.keys.map((key, index) => (
          <ShortcutKey skey={key} key={row.action} index={index} />
        ))}
      </div>
    </div>
  );
};
