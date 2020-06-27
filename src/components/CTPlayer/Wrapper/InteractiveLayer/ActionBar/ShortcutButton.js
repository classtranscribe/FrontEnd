import React from 'react';
import PropTypes from 'prop-types';
import ActionButton from '../ActionButton';

function ShortcutButton(props) {
  let { onClick } = props;
  return (
    <ActionButton
      label="Shortcuts"
      icon="keyboard"
      onClick={onClick}
      labelPlacement="bottom"
    />
  );
}

ShortcutButton.propTypes = {
  onClick: PropTypes.func
};

export default ShortcutButton;

