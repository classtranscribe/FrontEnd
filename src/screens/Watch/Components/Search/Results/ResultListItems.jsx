import React from 'react';
import _ from 'lodash';
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

const validateOnlySimpleSpanTags = (untrustedHTML) => {
  // Only "<span>" and "</span>" (with no attributes) are permitted.
  // See also htmlEncodeAndHighlightSearchedWords() in search_effects.js
  // The text is presented directly as html content (see use of dangerouslySetInnerHTML below)
  // This validation check ensures arbitrary search results cant accidentially inject
  // arbitrary html into the page.
  // We're not using regex - prefer simplicity for security-related code..
  const ignoreSpan = untrustedHTML.replace("<span>","").replace("</span>","");
  const isInvalid = ignoreSpan.includes("<") || ignoreSpan.includes(">");
  
  if(isInvalid) {
    // eslint-disable-next-line no-console
    console.log(`validateOnlySimpleSpanTags failed:${untrustedHTML}`);
  }
  return isInvalid ? _.escape(untrustedHTML) : untrustedHTML;
}
/**
 * The result listitem for Captions.

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
    <button className="plain-btn search-result-listitem" onKeyUp={handleClick} onClick={handleClick}>
      <div className="search-result-time">{prettierTimeStr(begin)}</div>
      <p className="search-result-text" kind={item.kind}>
        {item.kind === WEBVTT_DESCRIPTIONS && (
          <span className="text-muted">
            (Description)
            <br />
          </span>
        )}

        { /* text is already escaped */
          /*  eslint-disable-next-line react/no-danger */}
        <span className="search-result-content" dangerouslySetInnerHTML={{ __html: validateOnlySimpleSpanTags(text) }} />

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
      href={`video?id=${mediaId}`}
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
      <div className="shortcuts-key">
        {row.keys.map((key, index) => (
          <ShortcutKey skey={key} key={row.action} index={index} />
        ))}
      </div>
    </div>
  );
};
