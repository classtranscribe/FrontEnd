import React from 'react';
import PropTypes from 'prop-types';
import LaunchScreen from './LaunchScreen';
import './index.scss';

/**
 * The component used to generate a ePub file from a list of video screenshots and transcriptions
 */
function CTEPubGenerator(props) {
  return <LaunchScreen {...props} />
};

CTEPubGenerator.propTypes = {
  /** Create ePub books for a media */
  media: PropTypes.object
};

export default CTEPubGenerator;
export { CTEPubConstants } from './controllers';

