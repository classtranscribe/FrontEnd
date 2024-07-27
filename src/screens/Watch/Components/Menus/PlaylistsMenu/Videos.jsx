import React, { useEffect } from 'react';
import { useButtonStyles, CTLoader } from 'layout';
import { MediaCard } from 'components';
import Button from '@material-ui/core/Button';
import cx from 'classnames';
import { links, elem } from 'utils';
import { connectWithRedux } from '../../../Utils';

function Videos({
  // playlist,
  currMediaId = '',
  currPlaylist = {},
}) {
  let { medias } = currPlaylist;
  const btn = useButtonStyles();
  const btnClassName = cx(btn.tealLink, 'media-item-button');

  useEffect(() => {
    elem.scrollIntoCenter(currMediaId, {
      focus: true,
      alternate: () => elem.scrollIntoView('watch-videos-list'),
    });
  }, [currPlaylist]);

  return (
    <div id="watch-videos-list" className="watch-videos-list">
      <div className="watch-list-title" type="pl-name">
        {
          currPlaylist.name
          &&
          <i className="material-icons" aria-hidden="true">video_library</i>
        }
        <span>{currPlaylist.name}</span>
      </div>
      <ul className="w-100 d-flex flex-column p-0">
        {!medias ? (
          <CTLoader />
        ) : medias.length === 0 ? (
          <div className="w-100 d-flex justify-content-center align-items-center m-5">NO VIDEO</div>
        ) : (
              medias.map((me) => (
                  <div className='playlist-item'>
                    <MediaCard
                      row
                      dark
                      posterSize="small"
                      label={currMediaId === me.id ? 'NOW PLAYING' : null}
                      {...MediaCard.parse(me)}
                    />
                    <Button
                      className={btnClassName}
                      startIcon={<i className="material-icons">import_contacts</i>}
                      href={links.mspEpubSettings(me.id)}
                    >
                      I-Note
                    </Button>
                  </div>
              ))
            )}
      </ul>
    </div>
  );
}

export default connectWithRedux(Videos, ['playlist']);
