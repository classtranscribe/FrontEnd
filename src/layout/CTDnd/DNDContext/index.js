import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

function DNDContext(props) {
  const {
    contextId,
    className,
    role = 'list',
    disabled = false,
    onDragStart,
    onDragEnd,
    children,
  } = props;

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      <Droppable isDropDisabled={disabled} droppableId={contextId}>
        {(provided, { isDraggingOver }) => (
          <div 
            role={role} 
            className={cx('ct-dnd', 'dnd-li', className, { dragging: isDraggingOver })}
            ref={provided.innerRef} 
            {...provided.droppableProps}
          >
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

DNDContext.propTypes = {
  /** The dnd context id */
  contextId: PropTypes.string.isRequired,

  /** The additional classes */
  className: PropTypes.string,

  /** The role of the dnd container, default as "list" */
  role: PropTypes.string,

  /** The dnd can be disabled */
  disabled: PropTypes.bool,

  /** Function called when the drag events start in the dnd context */
  onDragStart: PropTypes.func,

  /** Function called when the drag events end in the dnd context */
  onDragEnd: PropTypes.func,

  /** The draggable elements */
  children: PropTypes.node,
};

export default DNDContext;

