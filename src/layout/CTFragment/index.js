import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './index.scss';
import CTLoadable from '../CTLoadable';
import { createCTFragmentProps } from './create-props';

function CTFragment(props) {
  let {
    id,
    role,
    className,
    styles = {},
    // styles
    center = false,
    vCenter = false,
    vEnd = false,
    hCenter = false,
    hEnd = false,
    list = false,
    fade = false,
    sticky = false,
    offsetTop = 0,
    padding,
    margin,
    borderTop = false,
    borderRight = false,
    borderBottom = false,
    borderLeft = false,
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

  if (typeof margin === 'number' || typeof margin === 'string') {
    margin = [margin];
  }
  
  let paddingStr = Array.isArray(padding) ? `${padding.join('px ')}px` : undefined;
  let marginStr = Array.isArray(margin) ? `${margin.join('px ')}px` : undefined;

  const fragmentStyles = {
    top: `${offsetTop }px`,
    padding: paddingStr,
    margin: marginStr,
    ...styles
  };

  const fragmentClassses = classNames(
    'ct-fragment',
    className,
    { 
      center,
      vCenter,
      vEnd,
      hCenter,
      hEnd,
      list,
      sticky,
      'ct-a-fade-in': fade,
      'border-top': borderTop,
      'border-right': borderRight,
      'border-bottom': borderBottom,
      'border-left': borderLeft
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

  /** display its children at the end vertically */
  vEnd: PropTypes.bool,

  /** Horizontally centering its children */
  hCenter: PropTypes.bool,

  /** display its children at the end horizontally */
  hEnd: PropTypes.bool,

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
   * The margin in `x 10px`, allows 1,2,3,4,5
   * @example
   * <CTFragment margin="1" ... /> // margin: 10px;
   * <CTFragment margin={3} ... /> // margin: 30px;
   * <CTFragment margin={[1,5]} ... /> // margin: 10px 50px;
   * <CTFragment margin={[2,3,4,5]} ... /> // margin: 20px 30px 40px 50px;
   */
  margin: PropTypes.oneOfType([
    paddingTypes,
    PropTypes.arrayOf(paddingTypes)
  ]),

  /** True if has a top border */
  borderTop: PropTypes.bool,

  /** True if has a right border */
  borderRight: PropTypes.bool,

  /** True if has a bottom border */
  borderBottom: PropTypes.bool,

  /** True if has a left border */
  borderLeft: PropTypes.bool,

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

export default CTFragment;