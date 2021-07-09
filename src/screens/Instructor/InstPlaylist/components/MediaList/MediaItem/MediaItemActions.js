import React from 'react';
import cx from 'classnames';
import Button from '@material-ui/core/Button';
import { links } from 'utils';
import { useButtonStyles } from 'layout';

function MediaItemActions({ mediaId, media, isUnavailable, dispatch }) {
  const btn = useButtonStyles();
  const btnClassName = cx(btn.tealLink, 'media-item-button');

  const handleDelete = () => {
    const confirm = {
      text: 'Are you sure you want to delete this video? (This action cannot be undone)',
      onConfirm: () => dispatch({ type: 'instplaylist/deleteMedias', payload: [mediaId] }),
    };
    dispatch({ type: 'instplaylist/setConfirmation', payload: confirm });
  };

  return (
    <div className="media-item-actions">
      <Button
        disabled={isUnavailable}
        className={btnClassName}
        startIcon={<i className="material-icons watch">play_circle_filled</i>}
        href={links.watch(mediaId)}
      >
        Watch
      </Button>
      {false ? (
        <Button
          className={btnClassName}
          startIcon={<i className="material-icons">text_snippet</i>}
          href={links.mspTransSettings(mediaId)}
        >
          Transcription
        </Button>
      ) : null}

      <Button
        disabled={!media.transReady || !media.sceneDetectReady}
        className={btnClassName}
        startIcon={<i className="material-icons">import_contacts</i>}
        href={links.mspEpubSettings(mediaId)}
      >
        ePub
      </Button>

      <Button
        className={btnClassName}
        startIcon={<i className="material-icons delete">delete</i>}
        onClick={handleDelete}
      >
        delete
      </Button>
    </div>
  );
}

export default MediaItemActions;
