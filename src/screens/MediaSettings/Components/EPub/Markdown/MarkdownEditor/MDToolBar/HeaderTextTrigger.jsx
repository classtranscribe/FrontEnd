import React from 'react';
import MDToolButton from './MDToolButton';
import { addHeaderText } from './ace.util';

function HeaderTextTrigger({
  ace,
}) {

  const handleAddHeaderText = () => addHeaderText(ace);

  return (
    <MDToolButton
      icon="title"
      popup="Add Header Text <cmd+h>"
      onClick={handleAddHeaderText}
    />
  );
}

export default HeaderTextTrigger;
