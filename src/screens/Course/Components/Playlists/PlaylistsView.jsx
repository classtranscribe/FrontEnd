import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { CTFragment, CTFooter, CTLoadable } from 'layout';
import { ARRAY_INIT, NOT_FOUND_404 } from 'utils';
import { plControl, setup } from '../../controllers';

import PlaylistItem from './PlaylistItem';
import PlaylistsErrorWrapper from './PlaylistsErrorWrapper';

function PlaylistsView({
  isInstMode,
  accessType,
  playlists
}) {
  const loading = playlists === ARRAY_INIT;
  const error = playlists === NOT_FOUND_404;

  const errorElement = <PlaylistsErrorWrapper accessType={accessType} />

  return (
    <CTFragment fade loading={loading} id="cp-pls-view" data-scroll>
      <CTFragment sticky vCenter className="title" as="h3">
        <i className="material-icons">list</i>
        <span>Playlists</span>
      </CTFragment>

      <DragDropContext onDragEnd={plControl.onDragEnd}>
        <Droppable isDropDisabled={!isInstMode} droppableId="pl-ord">
          {(provided) => (
            <CTLoadable error={error} errorElement={errorElement}>
              <div 
                role="list" 
                className="d-flex flex-column"
                ref={provided.innerRef} 
                {...provided.droppableProps}
              >
                {error ? null : playlists.map((pl, index) => (
                  <PlaylistItem
                    key={`pl-${pl.id}=${pl.name}`}
                    playlist={pl}
                    index={index}
                    draggable={isInstMode}
                  />
                ))}
              </div>
            </CTLoadable>
          )}
        </Droppable>
      </DragDropContext>
      
      <CTFooter />
    </CTFragment>
  )
}

export default PlaylistsView;
