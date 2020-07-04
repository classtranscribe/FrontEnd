import React from 'react';
import PropTypes from 'prop-types';
import DNDContext from './DNDContext';
import DNDItem from './DNDItem';

function DNDList(props) {
  const {
    contextId,
    disabled = false,
    contextClassName,
    itemClassName,
    onDragEnd,
    items = [],
  } = props;

  const contextProps = {
    contextId,
    disabled,
    onDragEnd,
    className: contextClassName
  };

  const dndItemsElement = items.map((item, index) => {
    const itemProps = {
      key: item.id,
      draggableId: item.id,
      index: item.index || index,
      disabled,
      className: itemClassName,
      children: item.node
    };

    return <DNDItem {...itemProps} />
  });

  return (
    <DNDContext {...contextProps}>
      {dndItemsElement}
    </DNDContext>
  );
}

DNDList.propTypes = {
  /** The dnd context id */
  contextId: DNDContext.propTypes.contextId,

  /** True if disbale the dnd */
  disabled: PropTypes.bool,

  /** Additional classes for context container */
  contextClassName: PropTypes.string,

  /** Additional classes for draggable items */
  itemClassName: PropTypes.string,

  /** Function called when the drag events end in the dnd context */
  onDragEnd: DNDContext.propTypes.onDragEnd,

  /** The draggable items */
  items: PropTypes.arrayOf(PropTypes.shape({
    index: PropTypes.number,
    id: PropTypes.string
  }))
};

export default DNDList;