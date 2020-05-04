import React from 'react';
import MDToolButton from './MDToolButton';
import { addBulletedList } from './ace.util';

function BulletedListTrigger({
  ace,
}) {

  return (
    <MDToolButton
      icon="format_list_bulleted"
      popup="Add a Bulleted List"
      onClick={() => addBulletedList(ace)}
    />
  );
}

export default BulletedListTrigger;
