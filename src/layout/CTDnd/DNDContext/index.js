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
    onDragEnd,
    children,
  } = props;

  const dndClasses = cx('d-flex', 'flex-column', className);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable isDropDisabled={disabled} droppableId={contextId}>
        {(provided) => (
          <div 
            role={role} 
            className={dndClasses}
            ref={provided.innerRef} 
            {...provided.droppableProps}
          >
            {children}
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

  /** Function called when the drag events end in the dnd context */
  onDragEnd: PropTypes.func,

  /** The draggable elements */
  children: PropTypes.node,
};

export default DNDContext;

