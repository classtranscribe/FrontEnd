import React from 'react';
import PropTypes from 'prop-types';
import MDToolButton from './MDToolButton';
import { addItalicText } from '../ace/ace-controller';
import { getShortcut } from '../ace/ace-shortcut';

function ItalicTextTrigger(props) {
  const { ace } = props;
  const handleAddItalicText = () => addItalicText(ace);

  return (
    <MDToolButton
      icon="format_italic"
      popup={`Add Italic Text ${ getShortcut('i')}`}
      onClick={handleAddItalicText}
    />
  );
}

ItalicTextTrigger.propTypes = {
  ace: PropTypes.any
};

export default ItalicTextTrigger;
