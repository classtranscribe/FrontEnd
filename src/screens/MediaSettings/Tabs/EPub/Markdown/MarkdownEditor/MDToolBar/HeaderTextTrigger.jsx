import React from 'react';
import MDToolButton from './MDToolButton';
import { addHeaderText } from '../ace/ace-controller';
import { getShortcut } from '../ace/ace-shortcut';

function HeaderTextTrigger({
  ace,
}) {

  const handleAddHeaderText = () => addHeaderText(ace);

  return (
    <MDToolButton
      icon="title"
      popup={"Add Header Text " + getShortcut('h')}
      onClick={handleAddHeaderText}
    />
  );
}

export default HeaderTextTrigger;
