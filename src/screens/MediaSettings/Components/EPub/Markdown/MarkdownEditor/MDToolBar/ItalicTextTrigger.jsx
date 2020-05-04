import React from 'react';
import MDToolButton from './MDToolButton';
import { addItalicText } from './ace.util';

function ItalicTextTrigger({
  ace,
}) {

  const handleAddItalicText = () => addItalicText(ace);

  return (
    <MDToolButton
      icon="format_italic"
      popup="Add Italic Text <cmd+i>"
      onClick={handleAddItalicText}
    />
  );
}

export default ItalicTextTrigger;
