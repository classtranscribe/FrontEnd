import _ from 'lodash';
import React, { useState, useEffect, useReducer } from 'react';
import { PlaylistTypes } from 'entities/Playlists';
import { CTCheckbox, CTForm } from 'layout';
import PropTypes from 'prop-types';
import PlaylistType from './PlaylistSelection';
import PlaylistName from './PlaylistName';
import PlaylistUrl from './PlaylistUrl';

export function NewPlaylistForm(props) {
  const { onSave } = props;

  const [name, setName] = useState('');
  const [sourceType, setsourceType] = useState(2);
  const [url, setUrl] = useState('');
  const [swapStreams, setSwapStreams] = useState(false);
  const [restrictRoomStream, setRestrictRoomStream] = useState(true);
  const [doAIDescriptions, setDoAIDescriptions] = useState(0);
  const [doCaptions, setDoCaptions] = useState(1);
  const [doAISummary, setDoAISummary] = useState(0);
  const [doTranslation, setDoTranslation] = useState("defaulttranslations");
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
      const options = { restrictRoomStream, swapStreams, doAIDescriptions, doCaptions, doAISummary, doTranslation };
      const config = { name: (name === '' ? 'Untitled Playlist' : name),
        sourceType, url, options };

      onSave(config);
    }
  };
// Todo refactor checkbox options into a component
// and remove duplication from PlaylistInfo

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
      <CTCheckbox id="cb-swapStreams" label="Fix incoming stream order (projector content is secondary stream)" checked={swapStreams} onChange={()=>setSwapStreams(!swapStreams)} />  
      <CTCheckbox id="cb-restrictRoomStream" label="For student privacy hide the secondary room-camera view" checked={restrictRoomStream} onChange={()=>setRestrictRoomStream(!restrictRoomStream)} /> 
      <CTCheckbox id="cb-doAIDescriptions" label="AI-generated descriptions" checked={doAIDescriptions===1} onChange={()=>setDoAIDescriptions((doAIDescriptions+1)%2)} />  
      <CTCheckbox id="cb-doAISummary" label="AI-generated summarization" checked={doAISummary===1} onChange={()=>setDoAISummary((doAISummary+1)%2)} />
      <CTCheckbox id="cb-doCaptions" label="Send audio to Microsoft for captioning" checked={doCaptions===1} onChange={()=>setDoCaptions((doCaptions+1)%2)} />  
      {doCaptions===1? <CTCheckbox id="cb-doTranslations" label="Translate captions into other languages" checked={doTranslation.length>0} onChange={()=>setDoTranslation(doTranslation.length===0?"defaulttranslations":"")} /> : null}
             
    </CTForm>
  );
}

NewPlaylistForm.propTypes = {
  onSave: PropTypes.func
};
