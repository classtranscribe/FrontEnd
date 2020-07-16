import React from 'react';
import PropTypes from 'prop-types';
import EPubGenerator from './EPubGenerator';

function CTEPubGenerator(props) {
  return <EPubGenerator {...props} />
};

CTEPubGenerator.propTypes = {
  mediaId: PropTypes.string,
  title: PropTypes.string
};

export default CTEPubGenerator;
export { CTEPubConstants } from './controllers';

