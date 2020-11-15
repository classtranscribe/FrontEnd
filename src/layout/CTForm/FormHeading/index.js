import React from 'react';
import PropTypes from 'prop-types';
import CTHeading from '../../CTHeading';

/**
 * A section heading component used in `CTForm`
 */
function FormHeading(props) {
  let {
    padding = [20, 0, 0, 0],
    children,
    ...otherProps
  } = props;

  return (
    <CTHeading uppercase highlight padding={padding} as="h4" {...otherProps}>
      {children}
    </CTHeading>
  );
}

FormHeading.propTypes = {
  ...CTHeading.propTypes,

  /** The primary content */
  children: PropTypes.node
};

export default FormHeading;
