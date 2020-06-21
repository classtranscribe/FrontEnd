import React from 'react';
import PropTypes from 'prop-types';
import MDToolButton from './MDToolButton';
import { addBoldText } from '../ace/ace-controller';
import { getShortcut } from '../ace/ace-shortcut';

function BoldTextTrigger(props) {
  const { ace } = props;
  const handleAddBoldText = () => addBoldText(ace);

  return (
    <MDToolButton
      icon="format_bold"
      popup={`Add Bold Text ${ getShortcut('b')}`}
      onClick={handleAddBoldText}
    />
  );
}

BoldTextTrigger.propTypes = {
  ace: PropTypes.any
};

export default BoldTextTrigger;
