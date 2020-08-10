import React from 'react';
import PropTypes from 'prop-types';
import MDToolButton from './MDToolButton';
import { addHeaderText } from '../ace/ace-controller';
import { getShortcut } from '../ace/ace-shortcut';

function HeaderTextTrigger(props) {
  const { ace } = props;
  const handleAddHeaderText = () => addHeaderText(ace);

  return (
    <MDToolButton
      icon="title"
      popup={`Add Header Text ${ getShortcut('h')}`}
      onClick={handleAddHeaderText}
    />
  );
}

HeaderTextTrigger.propTypes = {
  ace: PropTypes.any
};

export default HeaderTextTrigger;
