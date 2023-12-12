import React, { useState } from 'react';
import { uurl, links } from 'utils';
import { Playlist } from 'entities/Playlists';
import { InfoAndListLayout } from 'components';
import { CTCheckbox } from 'layout';
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
  const [restrictRoomStream, setRestrictRoomStream] = useState(playlist?.options?.restrictRoomStream || true);
  const [swapStreams, setSwapStreams] = useState(playlist?.options?.swapStreams || false);
  const [doAIDescriptions, setDoAIDescriptions] = useState(parseInt(playlist?.options?.doAIDescriptions,10) || 0);
  const [doCaptions, setDoCaptions] = useState(parseInt(playlist?.options?.doCaptions,10)||1);
  const [doAISummary, setDoAISummary] = useState(parseInt(playlist?.options?.doCaptions,10)||0);
  const [doTranslation, setDoTranslation] = useState(playlist?.options?.doTranslation || "defaulttranslations");
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
    newOptions.doCaptions = doCaptions;
    newOptions.doAISummary = doAISummary;
    newOptions.doTranslation = doTranslation;
    

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
// todo refactor checkbox options into a component
  return (
    <InfoAndListLayout.Info id="ipl-pl-info">
      <BreadCrumb offering={offering} playlist={playlist} />

      <PlaylistName {...plNameprops} />
      {editing ?
      (
        <>
          <CTCheckbox id="cb-swapStreams" label="Fix incoming stream order (projector content is secondary stream)" checked={swapStreams} onChange={()=>setSwapStreams(!swapStreams)} />  
          <CTCheckbox id="cb-restrictRoomStream" label="For student privacy hide the secondary room-camera view" checked={restrictRoomStream} onChange={()=>setRestrictRoomStream(!restrictRoomStream)} /> 
          <CTCheckbox id="cb-doAIDescriptions" label="AI-generated descriptions" checked={doAIDescriptions===1} onChange={()=>setDoAIDescriptions((doAIDescriptions+1)%2)} />  
          <CTCheckbox id="cb-doAISummary" label="AI-generated summarization" checked={doAISummary===1} onChange={()=>setDoAISummary((doAISummary+1)%2)} />
          <CTCheckbox id="cb-doCaptions" label="Send audio to Microsoft for captioning" checked={doCaptions===1} onChange={()=>setDoCaptions((doCaptions+1)%2)} />  
          {doCaptions===1? <CTCheckbox id="cb-doTranslations" label="Translate captions into other languages" checked={doTranslation.length>0} onChange={()=>setDoTranslation(doTranslation.length===0?"defaulttranslations":"")} /> : null}
          
        </>)
      : null }
      <Actions {...actionProps} />
    </InfoAndListLayout.Info>
  );
}

export const PlaylistInfo = PlaylistInfoWithRedux;


