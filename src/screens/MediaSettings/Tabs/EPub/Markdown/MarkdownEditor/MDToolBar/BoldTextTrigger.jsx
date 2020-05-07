import React from 'react';
import MDToolButton from './MDToolButton';
import { addBoldText } from '../ace/ace-controller';
import { getShortcut } from '../ace/ace-shortcut';

function BoldTextTrigger({
  ace,
}) {

  const handleAddBoldText = () => addBoldText(ace);

  return (
    <MDToolButton
      icon="format_bold"
      popup={"Add Bold Text " + getShortcut('b')}
      onClick={handleAddBoldText}
    />
  );
}

export default BoldTextTrigger;
