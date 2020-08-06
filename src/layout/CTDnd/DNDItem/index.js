import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
import './index.scss';

function DNDItem(props) {
  const {
    index,
    draggableId,
    disabled = false,
    role = 'listitem',
    className,
    children,
  } = props;

  const dragProps = {
    index,
    draggableId,
    isDragDisabled: disabled,
  };

  const getDNDItemClassName = dragging => {
    return cx(
      'ct-dnd', 
      'dnd-item-con', 
      {
        disabled, 
        dragging
      }, 
      className);
  };

  return (
    <Draggable {...dragProps}>
      {(provided, { isDragging }) => (
        <div
          className={getDNDItemClassName(isDragging)}
          role={role}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          tabIndex="-1"
        >
          <div className="ct-dnd dnd-icon" aria-hidden="true">
            <i className="material-icons">drag_indicator</i>
          </div>

          <div className="ct-dnd dnd-item">{children}</div>
        </div>
      )}
    </Draggable>
  );
}

DNDItem.propTypes = {
  /** The index of the draggable item */
  index: PropTypes.number.isRequired,

  /** An unique ID for the draggable item */
  draggableId: PropTypes.string.isRequired,

  /** True if diable the dragging */
  disabled: PropTypes.bool,

  /** The role of the draggable item, default as "listitem" */
  role: PropTypes.string,

  /** The additional classes */
  className: PropTypes.string,

  /** The primary content of the draggable item */
  children: PropTypes.node,
};

export default DNDItem;

