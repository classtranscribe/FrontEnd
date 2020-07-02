import React from 'react';
import PropTypes from 'prop-types';
import MDToolButton from './MDToolButton';
import { insertLink } from '../ace/ace-controller';
import { getShortcut } from '../ace/ace-shortcut';

function InsertLinkTrigger(props) {
  const { ace } = props;
  return (
    <MDToolButton
      icon="link"
      popup={`Insert a Link ${ getShortcut('k')}`}
      onClick={() => insertLink(ace)}
    />
  );
}

InsertLinkTrigger.propTypes = {
  ace: PropTypes.any
};

export default InsertLinkTrigger;
