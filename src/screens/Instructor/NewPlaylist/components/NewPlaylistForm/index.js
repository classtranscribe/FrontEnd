import _ from 'lodash';
import React, { useState, useEffect, useReducer } from 'react';
import { PlaylistTypes } from 'entities/Playlists';
import { CTCheckbox, CTForm,CTFragment } from 'layout';
import PropTypes from 'prop-types';
import PlaylistType from './PlaylistSelection';
import PlaylistName from './PlaylistName';
import PlaylistUrl from './PlaylistUrl';

export function NewPlaylistForm(props) {
  const { onSave } = props;

  const [name, setName] = useState('');
  const [sourceType, setsourceType] = useState(2);
  const [url, setUrl] = useState('');
  
  const [restrictRoomStream, setRestrictRoomStream] = useState(true);
  const [swapStreams, setSwapStreams] = useState( false);
  const [doAIDescriptions, setDoAIDescriptions] = useState( 0);
  const [doAzureCaptions, setDoAzureCaptions] = useState(1);
  const [doAISummary, setDoAISummary] = useState(0);
 
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
      const options = { restrictRoomStream, swapStreams, doAIDescriptions, doAzureCaptions, doAISummary };
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
      <>
        <CTFragment dFlexCol role="list" className="details">
            
          <span className='optionHeading'>Privacy</span>
          <CTCheckbox id="cb-restrictRoomStream" label="For student privacy hide the secondary room-camera view" checked={restrictRoomStream} onChange={()=>setRestrictRoomStream(!restrictRoomStream)} /> 
            
          <span className='optionHeading'>Video processing</span>
            
          <CTCheckbox id="cb-swapStreams" label="Swap incoming stream order (use this when the main content is provided as the secondary stream)" checked={swapStreams} onChange={()=>setSwapStreams(!swapStreams)} />  
          <CTCheckbox id="cb-doAIDescriptions" label="Describe images using AI" checked={doAIDescriptions===1} onChange={()=>setDoAIDescriptions((doAIDescriptions+1)%2)} />  
          <CTCheckbox id="cb-doAISummary" label="Summarize video using AI" checked={doAISummary===1} onChange={()=>setDoAISummary((doAISummary+1)%2)} />
          <CTCheckbox id="cb-doCaptions" label="Use Microsoft Azure Cloud for multi-language captions" checked={doAzureCaptions===1} onChange={()=>setDoAzureCaptions((doAzureCaptions+1)%2)} />  
      
        </CTFragment>
      </>
      
    </CTForm>
  );
}

NewPlaylistForm.propTypes = {
  onSave: PropTypes.func
};
