import React from 'react';
import PropTypes from 'prop-types';
import { CTHeading } from '../../CTHeading';

/**
 * A section heading component used in `CTForm`
 */
export function FormHeading(props) {
  let {
    padding,
    children
  } = props;

  return (
    <CTHeading uppercase highlight padding={padding} as="h4">
      {children}
    </CTHeading>
  );
}

FormHeading.propTypes = {
  /** The padding of the `CTFragment` */
  padding: CTHeading.propTypes.padding,

  /** The primary content */
  children: PropTypes.node
};
