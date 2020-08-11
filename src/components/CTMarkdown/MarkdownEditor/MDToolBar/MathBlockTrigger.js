import React from 'react';
import PropTypes from 'prop-types';
import MDToolButton from './MDToolButton';
import { insertMathCodeBlock } from '../ace/ace-controller';

function MathBlockTrigger(props) {
  const { ace } = props;
  const handleClick = () => insertMathCodeBlock(ace);

  return (
    <MDToolButton
      icon="functions"
      popup="Insert a LaTeX block"
      onClick={handleClick}
    />
  );
}

MathBlockTrigger.propTypes = {
  ace: PropTypes.any
};

export default MathBlockTrigger;
