import React from 'react';
import PropTypes from 'prop-types';
import CTLoader from '../CTLoader';

function CTLoadable(props) {
  let {
    error = false,
    errorElement,
    loading = false,
    loadingElement,
    children,
  } = props;

  if (error) {
    return errorElement;
  }

  if (loading) {
    return loadingElement || <CTLoader />;
  }

  return children;
}

CTLoadable.propTypes = {
  /** True if error occurs */
  error: PropTypes.bool,

  /** The element to display when there is an error */
  errorElement: PropTypes.node,

  /** True if is loading */
  loading: PropTypes.bool,

  /** The loader element */
  loadingElement: PropTypes.node,

  /** The primary content */
  children: PropTypes.node
};

export default CTLoadable;