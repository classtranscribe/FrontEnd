import React from 'react';
import PropTypes from 'prop-types';
import LaunchScreen from './LaunchScreen';

function CTEPubGenerator(props) {
  return <LaunchScreen {...props} />
};

CTEPubGenerator.propTypes = {
  media: PropTypes.object
};

export default CTEPubGenerator;
export { CTEPubConstants } from './controllers';

