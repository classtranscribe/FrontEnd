import React from 'react';
import PropTypes from 'prop-types';
import MDToolButton from '../MDToolButton';

function InsertMediaTrigger(props) {
  const { onClick } = props;

  return (
    <MDToolButton
      icon="add_photo_alternate"
      popup="Insert Images"
      onClick={onClick}
    />
  );
}

InsertMediaTrigger.propTypes = {
  onClick: PropTypes.func
};

export default InsertMediaTrigger;
