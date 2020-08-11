import React from 'react';
import PropTypes from 'prop-types';
import MDToolButton from './MDToolButton';
import { addNumberedList } from '../ace/ace-controller';

function NumberedListTrigger(props) {
  const { ace } = props;
  return (
    <MDToolButton
      icon="format_list_numbered"
      popup="Add a Numbered List"
      onClick={() => addNumberedList(ace)}
    />
  );
}

NumberedListTrigger.propTypes = {
  ace: PropTypes.any
};

export default NumberedListTrigger;
