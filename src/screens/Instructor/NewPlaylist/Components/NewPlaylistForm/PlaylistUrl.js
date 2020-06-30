import React from 'react';
import { CTFragment, CTFormHelp, CTInput } from 'layout';

const exampleYoutubeURL = 'https://www.youtube.com/playlist?list=THis-is-AN-examPle-plaYLIST-iD';
const exampleEchoAccessLink = 'https://echo360.org/section/tHis-iS-an-EXampLE-accESS-LiNk/public';
const exampleBoxURL = 'https://uofi.app.box.com/folder/12345678910';
const exampleKalturaBUL = 'https://mediaspace.illinois.edu/channel/CS+000+-+Fall+2019/123456789';
function PlaylistUrl(props) {
  let { error, enable, sourceType, url, setUrl } = props;
  const handleOnchanged = ({ target: { value } }) => setUrl(value);
  const emptyPlaylistUrl = error.includes('playlistUrl') && enable;

  switch (sourceType) {
    case 0: // Echo 360
      return (
        <CTFragment>
          <CTFormHelp title="Echo 360 INSTRUCTION">
            An Echo360 Access Link Example {exampleEchoAccessLink}
          </CTFormHelp>
          <CTInput
            required
            error={emptyPlaylistUrl}
            helpText={emptyPlaylistUrl ? 'Playlist Url is required' : ''}
            id="360-url"
            label="Echo360 Access Link"
            placeholder="Access Link"
            value={url}
            onChange={handleOnchanged}
          />
        </CTFragment>
      );
    case 1: // Youtube
      return (
        <CTFragment>
          <CTFormHelp title="Youtube INSTRUCTION">
            YouTube Playlist URL Example {exampleYoutubeURL}
          </CTFormHelp>
          <CTInput
            required
            error={emptyPlaylistUrl}
            helpText={emptyPlaylistUrl ? 'Playlist Url is required' : ''}
            id="youtube-url"
            label="YouTube Playlist URL"
            placeholder="Playlist URL"
            value={url}
            onChange={handleOnchanged}
          />
        </CTFragment>
      );
    case 3: // Kaltura/MediaSpace
      return (
        <CTFragment>
          <CTFormHelp title="Kaltura Instruction">
            An Kaltura Channel URL Example {exampleKalturaBUL}
          </CTFormHelp>
          <CTInput
            required
            error={emptyPlaylistUrl}
            helpText={emptyPlaylistUrl ? 'Playlist Url is required' : ''}
            id="Kaltura-url"
            label="Kaltura Channel URL"
            placeholder="Kaltura Channel URL"
            value={url}
            onChange={handleOnchanged}
          />
        </CTFragment>
      );
    case 4: // Box
      return (
        <CTFragment>
          <CTFormHelp title="Box Instruction">
            <span>
              Before creating the playlist, please
              <strong> SHARE </strong>your Box folder with our Box account
              <strong> cstranscribe@illinois.edu </strong>
            </span>
            An Box Folder URL Example {exampleBoxURL}
          </CTFormHelp>
          <CTInput
            required
            error={emptyPlaylistUrl}
            helpText={emptyPlaylistUrl ? 'Playlist Url is required' : ''}
            id="box-url"
            label="Box Folder URL"
            placeholder="Folder URL"
            value={url}
            onChange={handleOnchanged}
          />
        </CTFragment>
      );
    case 2: // Upload
    default:
      return null;
  }
}

export default PlaylistUrl;
