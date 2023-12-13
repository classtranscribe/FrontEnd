import React, { useState } from 'react';
import { uurl, links } from 'utils';
import { Playlist } from 'entities/Playlists';
import { InfoAndListLayout } from 'components';
import { CTCheckbox, CTFragment } from 'layout';
import BreadCrumb from './BreadCrumb';
import PlaylistName from './PlaylistName';
import Actions from './Actions';
import './index.scss';

const YOUTUBE_PREFIX = 'https://www.youtube.com/playlist';
function getPlaylistSourceURL({ sourceType, playlistIdentifier, jsonMetadata }) {
  let source = '';
  if (!playlistIdentifier) return source;
  if (jsonMetadata && jsonMetadata.source) {
    return jsonMetadata.source;
  }

  if (sourceType === 1) {
    // YouTube
    source = YOUTUBE_PREFIX + uurl.createSearch({ list: playlistIdentifier });
  } else if (sourceType === 3) {
    // Kaltura
    source = `(Kaltura Playlist ID) ${playlistIdentifier}`;
  } else if (sourceType === 4) {
    // Box
    source = `(Box Folder ID) ${playlistIdentifier}`;
  } else if (sourceType === 0) {
    // echo
    source = playlistIdentifier; // ECHO360_PREFIX + playlistIdentifier + '/public'
  }

  return source;
}
function PlaylistInfoWithRedux(props) {
  const { history, instplaylist, dispatch } = props;
  const {
    offering,
    playlist
  } = instplaylist;

  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(playlist.name);
  const [restrictRoomStream, setRestrictRoomStream] = useState(playlist?.options?.restrictRoomStream ?? true);
  const [swapStreams, setSwapStreams] = useState(playlist?.options?.swapStreams ?? false);
  const [doAIDescriptions, setDoAIDescriptions] = useState(parseInt(playlist?.options?.doAIDescriptions,10) || 0);
  const [doAzureCaptions, setDoAzureCaptions] = useState(parseInt(playlist?.options?.doAzureCaptions,10)||1);
  const [doAISummary, setDoAISummary] = useState(parseInt(playlist?.options?.doCaptions,10)||0);

  const handleEdit = () => setEditing(true);

  const onInputChange = ({ target: { value } }) => {
    setInputValue(value);
  };

  const handleCancelRename = () => setEditing(false);

  const handleRename = async () => {
    if (!inputValue) return;
    const newOptions = {... playlist.options} || {};
    newOptions.restrictRoomStream = restrictRoomStream;
    newOptions.swapStreams = swapStreams;
    newOptions.doAIDescriptions = doAIDescriptions;
    newOptions.doAzureCaptions = doAzureCaptions;
    newOptions.doAISummary = doAISummary;
    

    if (playlist.name !== inputValue || playlist.options !== newOptions) {
      const playlist_ = await Playlist.update(playlist, inputValue, newOptions);
      if (playlist_) {
        dispatch({type: 'instplaylist/setPlaylist', payload: playlist_.toObject()});
      }
    }
      handleCancelRename();
  };

  const handleDelete = () => {
    const confirm = {
      text: 'Are you sure you want to delete this playlist? This action cannot be undone!',
      onConfirm: async () => {
        const playlistId = playlist.id;
        const successed = await Playlist.delete(playlistId);
        if (successed) {
          history.push(links.course(offering.id));
        }
      }
    };
    dispatch({type: 'instplaylist/setConfirmation', payload: confirm});
  };

  const sourseURL = getPlaylistSourceURL(playlist);
  const plNameprops = {
    editing,
    sourseURL,
    inputValue,
    onInputChange,
    handleRename,
    ...playlist,
  };

  const actionProps = {
    editing,
    handleEdit,
    handleRename,
    handleCancelRename,
    handleDelete,
    playlistId: playlist.id,
    offeringId: offering.id
  };
// todo refactor checkbox options into a component and share with NewInstPlaylist
  return (
    <InfoAndListLayout.Info id="ipl-pl-info">
      <BreadCrumb offering={offering} playlist={playlist} />

      <PlaylistName {...plNameprops} />
      {editing ?
      (
        <CTFragment dFlexCol role="list" className="details">
            
          <span className='optionHeading'>Privacy</span>
          <CTCheckbox id="cb-restrictRoomStream" label="For student privacy hide the secondary room-camera view" checked={restrictRoomStream} onChange={()=>setRestrictRoomStream(!restrictRoomStream)} /> 
      
          <span className='optionHeading'>Video processing</span>
      
          <CTCheckbox id="cb-swapStreams" label="Swap incoming stream order (use this when the main content is provided as the secondary stream)" checked={swapStreams} onChange={()=>setSwapStreams(!swapStreams)} />  
          <CTCheckbox id="cb-doAIDescriptions" label="Describe images using AI" checked={doAIDescriptions===1} onChange={()=>setDoAIDescriptions((doAIDescriptions+1)%2)} />  
          <CTCheckbox id="cb-doAISummary" label="Summarize video using AI" checked={doAISummary===1} onChange={()=>setDoAISummary((doAISummary+1)%2)} />
          <CTCheckbox id="cb-doCaptions" label="Use Microsoft Azure Cloud for multi-language captions" checked={doAzureCaptions===1} onChange={()=>setDoAzureCaptions((doAzureCaptions+1)%2)} />  
      
        </CTFragment>)
        
        
      : null }
      <Actions {...actionProps} />
    </InfoAndListLayout.Info>
  );
}

export const PlaylistInfo = PlaylistInfoWithRedux;


