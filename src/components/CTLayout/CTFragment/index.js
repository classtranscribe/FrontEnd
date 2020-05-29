import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './index.scss';

export function CTFragment(props) {
  let {
    id,
    role,
    className,
    styles = {},
    center = false,
    vCenter = false,
    hCenter = false,
    list = false,
    fade = false,
    sticky = false,
    offsetTop = 0,
    padding = 0,
    children
  } = props;

  // format padding styles
  if (typeof padding === 'number' || typeof padding === 'string') {
    padding = [padding];
  }
  let paddingStr = `${padding.join('px ') }px`;

  const fragmentStyles = {
    top: `${offsetTop }px`,
    padding: paddingStr,
    ...styles
  };

  const fragmentClassses = classNames(
    'ct-fragment',
    className,
    { 
      center,
      vCenter,
      hCenter,
      list,
      sticky,
      'ct-a-fade-in': fade
    }
  );

  const fragmentProps = {
    id,
    role,
    className: fragmentClassses,
    style: fragmentStyles
  };

  return (
    <div {...fragmentProps}>
      {children}
    </div>
  );
}

const paddingTypes = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

CTFragment.propTypes = {
  /** A unique ID to the element */
  id: PropTypes.string,

  /** The Additional classes */
  className: PropTypes.string,

  /** The role to the `div` element */
  role: PropTypes.string,

  /** Additional inline styles */
  styles: PropTypes.object,

  /** Vertially and horizontally centering its children */
  center: PropTypes.bool,

  /** Vertially centering its children */
  vCenter: PropTypes.bool,

  /** Horizontally centering its children */
  hCenter: PropTypes.bool,

  /** The element can be a flex list */
  list: PropTypes.bool,

  /** The heading can fade in */
  fade: PropTypes.bool,

  /** The fragment can be sticky */
  sticky: PropTypes.bool,

  /** The `top` css attribute (in `px`) for the fragment element */
  offsetTop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * The padding in `x 10px`, allows 1,2,3,4,5
   * @example
   * <CTFragment padding="1" ... /> // padding: 10px;
   * <CTFragment padding={3} ... /> // padding: 30px;
   * <CTFragment padding={[1,5]} ... /> // padding: 10px 50px;
   * <CTFragment padding={[2,3,4,5]} ... /> // padding: 20px 30px 40px 50px;
   */
  padding: PropTypes.oneOfType([
    paddingTypes,
    PropTypes.arrayOf(paddingTypes)
  ]),

  /** The primary content */
  children: PropTypes.node
};