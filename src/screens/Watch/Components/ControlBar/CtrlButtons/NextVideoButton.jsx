import React from 'react';
import { withRouter } from 'dva/router';
import { MediaCard } from 'components';
import { api, links } from 'utils';
import { setup, connectWithRedux } from '../../../Utils';
import WatchCtrlButton from '../../WatchCtrlButton';
import setup2 from '../../../model/setup'
const Video = ({ media = null, label = false }) => (
  <MediaCard
    {...MediaCard.parse(media)}
    row
    dark
    posterSize="normal"
    label={label}
  />
);

export function NextVideoWithRedux(props) {
  const { nextBtn = true, media, playlist = {}, history } = props;
  let { prev, next } = setup2.findNeighbors(media.id, playlist);
  prev = api.parseMedia(prev);
  next = api.parseMedia(next);
  let canPlayPrev = Boolean(prev.id);
  let canPlayNext = Boolean(next.id);
  const handleChangeVideo = (toWatch) => {
    history.push(links.watch(toWatch.id));
  };

  const handlePlayNext = () => {
    handleChangeVideo(next);
  };

  const handlePlayPrev = () => {
    handleChangeVideo(prev);
  };

  const watchPrev = <Video media={prev} label="Previous video" />;
  const watchNext = <Video media={next} label="Next Video" />;

  if (nextBtn) {
    return (
      <WatchCtrlButton
        onClick={handlePlayNext}
        label={canPlayNext ? watchNext : 'End of the course'}
        id="next-video-btn"
        disabled={!canPlayNext}
        popupStyle={{ padding: '0' }}
        ariaTags={{
          'aria-label': 'Next Video',
        }}
      >
        <span aria-hidden="true" className="watch-btn-content" tabIndex="-1">
          <i className="material-icons">skip_next</i>
        </span>
      </WatchCtrlButton>
    );
  }
  return (
    <WatchCtrlButton
      onClick={handlePlayPrev}
      label={canPlayPrev ? watchPrev : 'End of the course'}
      id="prev-video-btn"
      disabled={!canPlayPrev}
      popupStyle={{ padding: '0' }}
      ariaTags={{
        'aria-label': 'Previous Video',
      }}
    >
      <span aria-hidden="true" className="watch-btn-content" tabIndex="-1">
        <i className="material-icons">skip_previous</i>
      </span>
    </WatchCtrlButton>
  );
}

export const NextVideoButton=withRouter(connectWithRedux(NextVideoWithRedux, ['media', 'playlist']))
