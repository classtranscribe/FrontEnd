import React from 'react';
import { Route } from 'dva/router.js';
import cx from 'classnames';
import Button from '@material-ui/core/Button';
import { links } from 'utils';
import { useButtonStyles, CTText } from 'layout';
import UploadASLButton from './UploadASLButton.js';
import { UploadSingleFile } from '../UploadFile/index.js';

function MediaItemActions({ playlistId, mediaId, media, isUnavailable, dispatch }) {
  const btn = useButtonStyles();
  const btnClassName = cx(btn.tealLink, 'media-item-button');
  const hasASL = media.hasAsl;

  const handleDelete = () => {
    const confirm = {
      text: 'Are you sure you want to delete this video? (This action cannot be undone)',
      onConfirm: () => dispatch({ type: 'instplaylist/deleteMedias', payload: [mediaId] }),
    };
    dispatch({ type: 'instplaylist/setConfirmation', payload: confirm });
  };

  const handleASLDelete = () => {
    const confirm = {
      text: 'Are you sure you want to delete this media\'s ASL video? This action cannot be undone.',
      onConfirm: () => dispatch({ type: 'instplaylist/deleteASL', payload: [mediaId]}),
    };
    dispatch({ type: 'instplaylist/setConfirmation', payload: confirm});
  }

  const setEpubErrorText = () => {
    if (!media.transReady && !media.sceneDetectReady)
      return 'epub creation waiting for transcription and scene analysis to complete.';
    if (!media.transReady) return 'epub creation waiting for transcription to complete.';
    if (!media.sceneDetectReady) return 'epub creation waiting for scene analysis to complete.';
  };

  return (
    <div>
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
          I-Note
        </Button>

        <Button
          className={btnClassName}
          startIcon={<i className="material-icons delete">delete</i>}
          onClick={handleDelete}
        >
          delete
        </Button>
        { !hasASL &&
          <UploadASLButton playlistId={playlistId} mediaId={mediaId} /> }        
        <Route path="/playlist/:playlistId/media/:mediaId/upload-asl" component={UploadSingleFile} /> 

        { hasASL &&
          <Button
            className={btnClassName}
            startIcon={<i className="material-icons upload">delete</i>}
            onClick={handleASLDelete}
            title="Delete ASL video"
          >
            delete ASL
          </Button> }
      </div>
      <div>
        {!media.transReady || !media.sceneDetectReady ? (
          <CTText muted padding={[0, 0, 5, 10]}>
            {setEpubErrorText()}
          </CTText>
        ) : null}
      </div>
    </div>
  );
}

export default MediaItemActions;
