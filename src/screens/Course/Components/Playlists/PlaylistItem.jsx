import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd';
import { CTFragment } from 'layout';
import { links } from 'utils/links';

function PlaylistItem({
  draggable,
  index,
  playlist
}) {
  const { id, name } = playlist;

  return (
    <Draggable isDragDisabled={!draggable} draggableId={`pl-${id}-${name}`} index={index}>
      {(provided, { isDragging }) => (
        <div
          className={classNames('pl-item', { dragging: isDragging, draggable })}
          role="listitem"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Link
            id={id}
            to={draggable ? links.instPlaylist(id) : `#plid=${id}`}
          >
            <CTFragment vCenter className="pl-name">
              <i className="material-icons">video_library</i>
              <span>{name}</span>
            </CTFragment>
            <i aria-hidden="true" className="material-icons pl-icon">chevron_right</i>
            {
              draggable
              &&
              <i aria-hidden="true" className="material-icons pl-icon left">drag_handle</i>
            }
          </Link>
        </div>
      )}
    </Draggable>
  );
}

export default PlaylistItem;
