import React from 'react';
import { CTFragment, CTFormHelp, CTInput } from 'layout';

const exampleYoutubePlaylistURL = 'https://www.youtube.com/playlist?list=THis-is-AN-examPle-plaYLIST-iD';
const exampleYoutubeChannelURL = 'https://www.youtube.com/channel/THis-is-AN-examPle-chaNNeL-iD';
const exampleEchoAccessLink = 'https://echo360.org/section/tHis-iS-an-EXampLE-accESS-LiNk/public';
const exampleBoxURL = 'https://uofi.app.box.com/folder/12345678910';
const exampleKalturaURL = 'https://mediaspace.illinois.edu/channel/CS+000+-+Fall+2019/123456789';
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
            <strong>Echo360 access link example:</strong> {exampleEchoAccessLink}
          </CTFormHelp>
          <CTInput
            required
            error={hasError}
            helpText={
              emptyPlaylistUrl 
              ? 'Echo360 access link is required' 
              : invalidUrl
              ? 'Invalid Echo360 access link'
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
              <div><strong>YouTube playlist URL example:</strong> {exampleYoutubePlaylistURL}</div>
              <div><strong>YouTube channel URL example:</strong> {exampleYoutubeChannelURL}</div>
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
            ClassTranscribe only copies videos, not the access settings. 
            The access settings may be different.
          </CTFormHelp>
          <CTFormHelp title="Provide the Kaltura Channel URL">
            <strong>Kaltura channel URL example:</strong> {exampleKalturaURL}
          </CTFormHelp>
          <CTInput
            required
            error={hasError}
            helpText={
              emptyPlaylistUrl 
              ? 'Kaltura playlist or channel URL is required' 
              : invalidUrl
              ? 'Invalid Kaltura playlist or channel URL'
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
            ClassTranscribe only copies videos, not the access settings. 
            The access settings may be different.
          </CTFormHelp>
          <CTFormHelp title="Provide the Box Folder URL">
            <CTFragment dFlexCol>
              <div>
                Before creating the playlist, please
                <strong> SHARE </strong>your Box folder with our Box account
                <strong> cstranscribe@illinois.edu </strong>
              </div>
              <div><strong>Box folder URL example:</strong> {exampleBoxURL}</div>
            </CTFragment>
          </CTFormHelp>
          <CTInput
            required
            error={hasError}
            helpText={
              emptyPlaylistUrl 
              ? 'Box folder URL is required' 
              : invalidUrl
              ? 'Invalid Box folder URL'
              : ''
            }
            id="box-url"
            label="Box Folder URL"
            placeholder="Box URL"
            value={url}
            onChange={handleOnchanged}
          />
        </CTFragment>
      );
    case 2: // Upload
      return (
        <CTFragment>
          <CTFormHelp title="Manual playlist">
            Select videos to upload after creating the playlist shell.
          </CTFormHelp>
        </CTFragment>
      );
    default:
      return null;
  }
}

export default PlaylistUrl;
