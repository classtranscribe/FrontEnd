import _ from 'lodash';
import React, { useState, useEffect, useReducer } from 'react';
import { PlaylistTypes } from 'entities/Playlists';
import { CTForm } from 'layout';
import PropTypes from 'prop-types';
import PlaylistType from './PlaylistSelection';
import PlaylistName from './PlaylistName';
import PlaylistUrl from './PlaylistUrl';

export function NewPlaylistForm(props) {
  const { onSave } = props;

  const [name, setName] = useState('');
  const [sourceType, setsourceType] = useState(2);
  const [url, setUrl] = useState('');

  // errors
  const initErrors = [];
  const errorReducer = (error, action) => {
    if (Array.isArray(action)) {
      if (action[0]) {
        return _.concat(error, action[1]);
      }
      return _.pull(error, action[1]);
    }
    return error;
  };

  const [error, errorDispatch] = useReducer(errorReducer, initErrors);
  const [enable, setEnable] = useState(false);

  const playlistNameProps = { error, enable, name, setName };
  const sourceTypeProps = { error, enable, sourceType, setsourceType };
  const playlistUrlProps = { error, enable, sourceType, url, setUrl };

  useEffect(() => {
    // errorDispatch([!name, 'playlistName']);
    errorDispatch([!url && sourceType !== 2, 'playlistUrl']);
    errorDispatch([url && !PlaylistTypes.isValidUrl(sourceType, url), 'valid-id']);
  }, [name, url]);

  useEffect(() => {
    // reset url when sourceType changes
    setUrl('');
  }, [sourceType]);

  const handleSave = async () => {
    setEnable(true);
    if (error.length === 0 && typeof onSave === 'function') {
      onSave({ name: (name === '' ? 'Untitled Playlist' : name), sourceType, url });
    }
  };

  return (
    <CTForm
      heading="Playlist Information"
      padding={[10, 35]}
      id="ctform-basics"
      onSave={handleSave}
      onSaveButtonText="Create New Playlist"
      details="Create a new playlist"
    >
      <PlaylistName {...playlistNameProps} />
      <PlaylistType {...sourceTypeProps} />
      <PlaylistUrl {...playlistUrlProps} />
    </CTForm>
  );
}

NewPlaylistForm.propTypes = {
  onSave: PropTypes.func
};
