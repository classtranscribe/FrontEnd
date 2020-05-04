import React from 'react';
import MDToolButton from './MDToolButton';
import { addBoldText } from './ace.util';

function BoldTextTrigger({
  ace,
}) {

  const handleAddBoldText = () => addBoldText(ace);

  return (
    <MDToolButton
      icon="format_bold"
      popup="Add Bold Text <cmd+b>"
      onClick={handleAddBoldText}
    />
  );
}

export default BoldTextTrigger;
