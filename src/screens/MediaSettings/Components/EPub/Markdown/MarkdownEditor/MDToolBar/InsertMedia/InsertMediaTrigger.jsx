import React from 'react';
import MDToolButton from '../MDToolButton';

function InsertMediaTrigger({
  onClick,
}) {

  return (
    <MDToolButton
      icon="add_photo_alternate"
      popup="Add Chapter Cover Image"
      onClick={onClick}
    />
  );
}

export default InsertMediaTrigger;
