import React from 'react';
import MDToolButton from './MDToolButton';
import { insertLink } from './ace.util';

function InsertLinkTrigger({
  ace,
}) {

  return (
    <MDToolButton
      icon="link"
      popup="Insert a Link <cmd+k>"
      onClick={() => insertLink(ace)}
    />
  );
}

export default InsertLinkTrigger;
