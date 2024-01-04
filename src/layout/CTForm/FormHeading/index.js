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
  const {as = "h3" } = otherProps
  return (
    <CTHeading uppercase highlight padding={padding} as={as} {...otherProps}>
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
