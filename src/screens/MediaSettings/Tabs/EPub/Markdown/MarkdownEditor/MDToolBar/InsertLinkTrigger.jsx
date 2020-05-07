import React from 'react';
import MDToolButton from './MDToolButton';
import { insertLink } from '../ace/ace-controller';
import { getShortcut } from '../ace/ace-shortcut';

function InsertLinkTrigger({
  ace,
}) {

  return (
    <MDToolButton
      icon="link"
      popup={"Insert a Link " + getShortcut('k')}
      onClick={() => insertLink(ace)}
    />
  );
}

export default InsertLinkTrigger;
