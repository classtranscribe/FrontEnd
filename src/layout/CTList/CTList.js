import React from 'react';
import PropTypes from 'prop-types';
import CTFragment from '../CTFragment';
import CTListItem from './CTListItem';

function CTList(props) {
  const {
    id,
    role = 'list',
    className,
    items = [],
    ...listProps
  } = props;

  return (
    <CTFragment id={id} dFlexCol role={role} className={className} {...listProps}>
      {items.map(item => <CTListItem key={item.id} {...item} />)}
    </CTFragment>
  );
}

CTList.propTypes = {
  /** An unique id */
  id: PropTypes.string,

  /** role of the list, default as `list` */
  role: PropTypes.string,

  /** Addtional classes */
  className: PropTypes.string,

  /** List items using `CTListItem` */
  items: PropTypes.arrayOf(PropTypes.shape(CTListItem.propTypes)),
};

export default CTList;

