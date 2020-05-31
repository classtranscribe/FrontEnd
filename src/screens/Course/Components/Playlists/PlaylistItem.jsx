import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd';
import { CTFragment } from 'layout';
import { links } from 'utils/links';
import { setup } from '../../controllers';

function PlaylistItem({
  role,
  index,
  playlist
}) {
  const { id, name } = playlist;
  const isInstructor = setup.isInstructor(role);

  return (
    <Draggable isDragDisabled={!isInstructor} draggableId={`pl-${id}-${name}`} index={index}>
      {(provided, { isDragging }) => (
        <div
          className={classNames('pl-item', { dragging: isDragging, draggable: isInstructor })}
          role="listitem"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Link
            id={id}
            to={isInstructor ? links.instPlaylist(id) : `#plid=${id}`}
          >
            <CTFragment vCenter className="pl-name">
              <i className="material-icons">video_library</i>
              <span>{name}</span>
            </CTFragment>
            <i aria-hidden="true" className="material-icons pl-icon">chevron_right</i>
            {
              isInstructor
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
