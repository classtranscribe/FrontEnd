import React from 'react';
import MDToolButton from './MDToolButton';
import { addNumberedList } from './ace.util';

function NumberedListTrigger({
  ace,
}) {

  return (
    <MDToolButton
      icon="format_list_numbered"
      popup="Add a Numbered List"
      onClick={() => addNumberedList(ace)}
    />
  );
}

export default NumberedListTrigger;
