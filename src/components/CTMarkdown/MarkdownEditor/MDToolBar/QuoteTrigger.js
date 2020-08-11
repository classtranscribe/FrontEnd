import React from 'react';
import PropTypes from 'prop-types';
import MDToolButton from './MDToolButton';
import { insertQuote } from '../ace/ace-controller';

function QuoteTrigger(props) {
  const { ace } = props;
  return (
    <MDToolButton
      icon="format_quote"
      popup="Insert a Quote"
      onClick={() => insertQuote(ace)}
    />
  );
}

QuoteTrigger.propTypes = {
  ace: PropTypes.any
};

export default QuoteTrigger;
