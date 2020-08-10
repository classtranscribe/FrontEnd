import React from 'react';
import PropTypes from 'prop-types';
import MDToolButton from './MDToolButton';
import { insertCode } from '../ace/ace-controller'

function CodeTrigger(props) {
  const { ace } = props;
  const handleInsertCode = () => insertCode(ace);

  return (
    <MDToolButton
      icon="code"
      popup="Insert Code"
      onClick={handleInsertCode}
    />
  );
}

CodeTrigger.propTypes = {
  ace: PropTypes.any
};

export default CodeTrigger;
