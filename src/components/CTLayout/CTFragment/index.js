import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './index.scss';
import { CTLoadable } from '../CTLoadable';
import { createCTFragmentProps } from './create-props';

export function CTFragment(props) {
  let {
    id,
    role,
    className,
    styles = {},
    // styles
    center = false,
    vCenter = false,
    hCenter = false,
    list = false,
    fade = false,
    sticky = false,
    offsetTop = 0,
    padding,
    // loadable
    error = false,
    errorElement,
    loading = false,
    loadingElement,
    // content
    as = 'div',
    children,
    ...otherProps
  } = props;

  // format padding styles
  if (typeof padding === 'number' || typeof padding === 'string') {
    padding = [padding];
  }
  
  let paddingStr = Array.isArray(padding) ? `${padding.join('px ') }px` : undefined;

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
    style: fragmentStyles,
    children,
    ...otherProps
  };

  const Element = React.createElement(as, fragmentProps);
  const loadableProps = {
    error,
    errorElement,
    loading,
    loadingElement
  };

  return (
    <CTLoadable {...loadableProps}>
      {Element}
    </CTLoadable>
  );
}

const paddingTypes = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

CTFragment.propTypes = {
  ...CTLoadable.propTypes,

  /** The unique ID to the element */
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

  /** The fragment can be a flex list */
  list: PropTypes.bool,

  /** The fragment can fade in */
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

  /**
   * A HTML tag name for this fragment, default as `div`
   * @example
   * <CTFragment as="a" ... >...</CTFragment> // <a ... >...</a>
   * <CTFragment as="ul" ... >...</CTFragment> // <ul ... >...</ul>
   */
  as: PropTypes.string,

  /** The primary content */
  children: PropTypes.node,
};

CTFragment.createProps = createCTFragmentProps;