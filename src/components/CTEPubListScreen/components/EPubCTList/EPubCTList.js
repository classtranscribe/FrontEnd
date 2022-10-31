import React from 'react';
import PropTypes from 'prop-types';
import { CTFragment } from 'layout';
import EPubCTListItem from './EPubCTListItem';

function EPubCTList(props) {
  const {
    id,
    role = 'list',
    className,
    items = [],
    onDelete,
    ...listProps
  } = props;

  return (
    <CTFragment id={id} dFlexCol role={role} className={className} {...listProps}>
      {items.map(item => <EPubCTListItem key={item.id} {...item} />)}
    </CTFragment>
  );
}

EPubCTList.propTypes = {
  /** An unique id */
  id: PropTypes.string,

  /** role of the list, default as `list` */
  role: PropTypes.string,

  /** Addtional classes */
  className: PropTypes.string,

  /** List items using `CTListItem` */
  items: PropTypes.arrayOf(PropTypes.shape(EPubCTListItem.propTypes)),
};

export default EPubCTList;

