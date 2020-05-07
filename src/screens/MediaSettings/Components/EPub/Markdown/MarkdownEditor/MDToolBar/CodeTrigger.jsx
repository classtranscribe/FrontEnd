import React from 'react';
import MDToolButton from './MDToolButton';
import { insertCode } from '../ace/ace-controller'

function CodeTrigger({
  ace,
}) {

  const handleInsertCode = () => insertCode(ace);

  return (
    <MDToolButton
      icon="code"
      popup="Insert Code"
      onClick={handleInsertCode}
    />
  );
}

export default CodeTrigger;
