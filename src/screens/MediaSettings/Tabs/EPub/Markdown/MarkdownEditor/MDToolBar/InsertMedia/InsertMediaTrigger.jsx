import React from 'react';
import MDToolButton from '../MDToolButton';

function InsertMediaTrigger({
  onClick,
}) {

  return (
    <MDToolButton
      icon="add_photo_alternate"
      popup="Insert Images"
      onClick={onClick}
    />
  );
}

export default InsertMediaTrigger;
