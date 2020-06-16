import _ from 'lodash';
import React, { useEffect, useState, createRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Sticky } from 'semantic-ui-react';
import { CTLoader } from 'layout';
import { links, uurl } from 'utils';

import {
  connectWithRedux,
  filterControl,
  NEW_PLAYLIST,
  OFF_ANALYSIS,
  NEW_OFFERING,
  HIDE_PLAYLIST,
  NO_PLAYLIST,
  OFF_SETTINGS,
  plControl, // NO_OFFERING_ID,
} from '../../Utils';
import './index.scss';

import { Filter } from '../Filter';

import PlaylistInfo from './PlaylistInfo';
import ButtonBar from './ButtonBar';
import VideoItem from './VideoItem';
import MediaDetail from './MediaDetail';

// import NoPlaylistHolder from './NoPlaylistHolder'
import NoVideoHolder from './NoVideoHolder';

import NewPlaylist from './NewPlaylist';
import UploadVideo from './UploadVideo';

function PlaylistWithRedux({
  offering = {},
  playlist = {},
  playlists = [],
  isEditingOffering = false,
  isViewingAnalytics = false,
}) {
  // Determine the context
  const newOffering = offering === NEW_OFFERING;
  const offSettings = playlist === OFF_SETTINGS;
  const noPlaylist = playlist === NO_PLAYLIST;
  const canShowPlaylists =
    Boolean(playlist.id) &&
    playlists.length > 0 &&
    offering.id &&
    playlist !== OFF_ANALYSIS &&
    playlist !== NEW_PLAYLIST;

  // Media results to display
  const [results, setResults] = useState([]);
  const onFilter = (value) => filterControl.filterMedias(value, playlist.medias, setResults);
  const onReverse = () => filterControl.reverse(results, setResults);

  // Determine whether to display upload screen
  const [isUploading, setIsUploading] = useState(false);
  const onOpenUpload = () => setIsUploading(true);
  const onCloseUpload = () => setIsUploading(false);

  // Current selected media
  const [currMedia, setCurrMedia] = useState('');
  const openMedia = (me) => () => {
    uurl.pushSearch({ mid: me.id });
    setCurrMedia(me);
  };
  const closeMedia = () => {
    uurl.pushSearch({ mid: undefined });
    setCurrMedia({});
  };

  // The context of the playlist component
  const stickyContextRef = createRef();
  const [isTop, setIsTop] = useState(true);

  // filter
  const [filtering, setFiltering] = useState(false);

  // Update results when playlist changes
  useEffect(() => {
    if (canShowPlaylists) {
      setResults(playlist.medias || []);
      if (isUploading) setIsUploading(false);
    }
    if (currMedia.id) closeMedia();

    // if mid is specified in the url
    const { mid } = uurl.useSearch();
    if (mid && playlist.medias && playlist.medias.length > 0) {
      const requestMedia = _.find(playlist.medias, { id: mid });
      if (requestMedia) {
        openMedia(requestMedia)();
      } else {
        // if the mid is incorrect, remove mid from url
        uurl.pushSearch({ mid: null });
      }
    }
  }, [playlist]);

  const { pathname } = useLocation();

  if (pathname === links.instNewOffering()) return null;
  // Conditions not display playlist
  if (isEditingOffering || isViewingAnalytics) return null;
  if (!offering.id) return null;
  if (newOffering || offSettings || playlist === HIDE_PLAYLIST) return null;

  // Special contexts
  // if (noPlaylist) return <NoPlaylistHolder />
  if (playlist === NEW_PLAYLIST || noPlaylist)
    return <NewPlaylist offeringId={offering.id} noPlaylist={noPlaylist} />;
  if (isUploading) return <UploadVideo playlist={playlist} onClose={onCloseUpload} />;

  return (
    <div ref={stickyContextRef} className="ip-playlist">
      {canShowPlaylists ? (
        <div className="ct-a-fade-in ip-playlist-con" data-scroll>
          {/* Playlist Info */}
          <Sticky
            pushing
            offset={48}
            context={stickyContextRef}
            onStick={() => setIsTop(false)}
            onUnstick={() => setIsTop(true)}
          >
            <PlaylistInfo playlist={playlist} isTop={isTop} />
          </Sticky>

          <div className="ip-pl-detail ct-d-c">
            {playlist.createdAt && (
              <div>
                <b>CREATED AT</b>
                <span className="pl-2">{playlist.createdAt.slice(0, 10)}</span>
              </div>
            )}
            {plControl.getPlaylistSourceURL(playlist) && (
              <div>
                <b>SOURCE</b>
                <span className="pl-2">{plControl.getPlaylistSourceURL(playlist)}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="ip-sb-title ct-d-r-center-v mt-3" style={{ background: 'transparent' }}>
            <i className="material-icons" aria-hidden="true">
              video_library
            </i>
            <h3>VIDEOS</h3>
          </div>

          {/* Selecting Buttons */}
          <ButtonBar
            results={results}
            filtering={filtering}
            setFiltering={setFiltering}
            upload={playlist.sourceType === 2}
            onOpenUpload={onOpenUpload}
          />

          {playlist.medias.length > 0 && filtering && (
            <div className="w-100 ct-a-fade-in mb-2">
              <Filter // darker
                searchFor="Videos"
                onFilter={onFilter}
                onReverse={onReverse}
              />
            </div>
          )}

          {/* Video Items */}
          {playlist.medias.length === 0 ? (
            <NoVideoHolder type={playlist.sourceType} />
          ) : (
            <div className="ct-list-col ip-videos">
              {results.map((me) => (
                <VideoItem
                  key={me.id}
                  media={me}
                  current={me.id === currMedia.id}
                  openMedia={openMedia}
                  courseNumber={offering.courseNumber}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <CTLoader />
      )}

      {currMedia.id && <MediaDetail media={currMedia} onClose={closeMedia} />}
    </div>
  );
}

export const Playlist = connectWithRedux(PlaylistWithRedux, [
  'offering',
  'playlist',
  'playlists',
  'isEditingOffering',
  'isViewingAnalytics',
]);
