import React from 'react';
import MDToolButton from './MDToolButton';
import { addItalicText } from '../ace/ace-controller';
import { getShortcut } from '../ace/ace-shortcut';

function ItalicTextTrigger({
  ace,
}) {

  const handleAddItalicText = () => addItalicText(ace);

  return (
    <MDToolButton
      icon="format_italic"
      popup={"Add Italic Text " + getShortcut('i')}
      onClick={handleAddItalicText}
    />
  );
}

export default ItalicTextTrigger;
