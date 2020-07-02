import React from 'react';
import PropTypes from 'prop-types';
import MDToolButton from './MDToolButton';
import { addBulletedList } from '../ace/ace-controller';

function BulletedListTrigger(props) {
  const { ace } = props;
  return (
    <MDToolButton
      icon="format_list_bulleted"
      popup="Add a Bulleted List"
      onClick={() => addBulletedList(ace)}
    />
  );
}

BulletedListTrigger.propTypes = {
  ace: PropTypes.any
};

export default BulletedListTrigger;
