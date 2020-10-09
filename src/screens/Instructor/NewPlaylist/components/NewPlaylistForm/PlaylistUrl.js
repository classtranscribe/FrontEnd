import React from 'react';
import { CTFragment, CTFormHelp, CTInput } from 'layout';

const exampleYoutubePlaylistURL = 'https://www.youtube.com/playlist?list=THis-is-AN-examPle-plaYLIST-iD';
const exampleYoutubeChannelURL = 'https://www.youtube.com/channel/THis-is-AN-examPle-chaNNeL-iD';
const exampleEchoAccessLink = 'https://echo360.org/section/tHis-iS-an-EXampLE-accESS-LiNk/public';
const exampleBoxURL = 'https://uofi.app.box.com/folder/12345678910';
const exampleKalturaBUL = 'https://mediaspace.illinois.edu/channel/CS+000+-+Fall+2019/123456789';
function PlaylistUrl(props) {
  let { error, enable, sourceType, url, setUrl } = props;
  const handleOnchanged = ({ target: { value } }) => setUrl(value);
  const emptyPlaylistUrl = error.includes('playlistUrl') && enable;
  const invalidUrl = error.includes('valid-id');

  const hasError = emptyPlaylistUrl || invalidUrl;

  switch (sourceType) {
    case 0: // Echo 360
      return (
        <CTFragment>
          <CTFormHelp title="Provide the Echo360 Access Link">
            Echo360 Access Link Example {exampleEchoAccessLink}
          </CTFormHelp>
          <CTInput
            required
            error={hasError}
            helpText={
              emptyPlaylistUrl 
              ? 'Echo360 Access Link is required' 
              : invalidUrl
              ? 'Invalid Echo360 Access Link'
              : ''
            }
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
          <CTFormHelp title="Provide the YouTube Playlist URL">
            <CTFragment dFlexCol>
              <div>YouTube Playlist URL Example {exampleYoutubePlaylistURL}</div>
              <div>YouTube Channel URL Example {exampleYoutubeChannelURL}</div>
            </CTFragment>
          </CTFormHelp>
          <CTInput
            required
            error={hasError}
            helpText={
              emptyPlaylistUrl 
              ? 'YouTube playlist or channel URL is required' 
              : invalidUrl
              ? 'Invalid YouTube playlist or channel URL'
              : ''
            }
            id="youtube-url"
            label="YouTube Playlist or Channel URL"
            placeholder="YouTube URL"
            value={url}
            onChange={handleOnchanged}
          />
        </CTFragment>
      );
    case 3: // Kaltura/MediaSpace
      return (
        <CTFragment>
          <CTFormHelp severity="warning" title="Notice">
            ClassTranscribe only copy videos not the access settings. 
            The access settings may be different.
          </CTFormHelp>
          <CTFormHelp title="Provide the Kaltura Channel URL">
            Kaltura Channel URL Example {exampleKalturaBUL}
          </CTFormHelp>
          <CTInput
            required
            error={hasError}
            helpText={
              emptyPlaylistUrl 
              ? 'Kaltura Channel URL is required' 
              : invalidUrl
              ? 'Invalid Kaltura Channel URL'
              : ''
            }
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
          <CTFormHelp severity="warning" title="Notice">
            ClassTranscribe only copy videos not the access settings. 
            The access settings may be different.
          </CTFormHelp>
          <CTFormHelp title="Provide the Box Folder URL">
            <CTFragment dFlexCol>
              <div>
                Before creating the playlist, please
                <strong> SHARE </strong>your Box folder with our Box account
                <strong> cstranscribe@illinois.edu </strong>
              </div>
              <div>Box Folder URL Example {exampleBoxURL}</div>
            </CTFragment>
          </CTFormHelp>
          <CTInput
            required
            error={hasError}
            helpText={
              emptyPlaylistUrl 
              ? 'Box Folder URL is required' 
              : invalidUrl
              ? 'Invalid Box Folder URL'
              : ''
            }
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
