import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './index.scss';
import CTLoadable from '../CTLoadable';

const _joinCSSOffsets = (format) => {
  if (typeof format === 'number' || typeof format === 'string') {
    format = [format];
  }

  return Array.isArray(format) ? `${format.join('px ')}px` : undefined;
};

function CTFragment(props) {
  const {
    id,
    role,
    className,
    styles = {},
    as = 'div',
    children,
    // layout
    dFlex,
    dFlexCol,
    center,
    justConCenter,
    justConEnd,
    justConBetween,
    alignItCenter,
    alignItEnd,
    h100,
    height,
    minheight,
    maxHeight,
    width,
    minWidth,
    maxWidth,
    padding,
    margin,
    borderRadius,
    bordered,
    borderTop = false,
    borderRight = false,
    borderBottom = false,
    borderLeft = false,
    overflowHidden,
    scrollY,
    scrollX,
    // styles
    raised,
    shadowed,
    fadeIn,
    dark,
    sticky,
    offsetTop = 0,
    // loadable
    error = false,
    errorElement,
    loading = false,
    loadingElement,
    alt,
    altElement,
    ...otherProps
  } = props;
  
  let paddingStr = _joinCSSOffsets(padding)
  let marginStr = _joinCSSOffsets(margin);
  let borderRadiusStr = _joinCSSOffsets(borderRadius);

  const fragmentStyles = {
    top: offsetTop ? `${offsetTop }px` : undefined,
    height,
    minheight,
    maxHeight,
    width,
    minWidth,
    maxWidth,
    padding: paddingStr,
    margin: marginStr,
    borderRadius: borderRadiusStr,
    ...styles
  };

  const fragmentClasses = classNames(
    'ct-fragment',
    className,
    {
      sticky,
      dark,
      raised,
      shadowed,
      'h-100': h100,
      'd-flex': (dFlex || dFlexCol || center 
              || justConCenter || justConEnd || justConBetween 
              || alignItCenter || alignItEnd),
      'flex-column': dFlexCol,
      'justify-content-center': justConCenter || center,
      'justify-content-end': justConEnd,
      'justify-content-between': justConBetween,
      'align-items-center': alignItCenter || center,
      'align-items-end': alignItEnd,
      'ct-a-fade-in': fadeIn,
      'bordered': bordered,
      'border-top': borderTop,
      'border-right': borderRight,
      'border-bottom': borderBottom,
      'border-left': borderLeft,
      'overflow-hidden': overflowHidden,
      'scroll-y': scrollY,
      'scroll-x': scrollX,
    }
  );

  const fragmentProps = {
    id,
    role,
    className: fragmentClasses,
    style: fragmentStyles,
    children,
    ...otherProps
  };
  const Element = React.createElement(as, fragmentProps);
  const loadableProps = {
    error,
    errorElement,
    loading,
    loadingElement,
    alt,
    altElement,
  };

  return (
    <CTLoadable {...loadableProps}>
      {Element}
    </CTLoadable>
  );
}

const CSSTypes = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

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

  /**
   * A HTML tag name for this fragment, default as `div`
   * @example
   * <CTFragment as="a" ... >...</CTFragment> // <a ... >...</a>
   * <CTFragment as="ul" ... >...</CTFragment> // <ul ... >...</ul>
   */
  as: PropTypes.elementType,

  /** The primary content */
  children: PropTypes.node,

  /** height: 100% */
  h100: PropTypes.bool,

  /** styles.height */
  height: PropTypes.string,

  /** styles.minheight */
  minheight: PropTypes.string,

  /** styles.maxHeight */
  maxHeight: PropTypes.string,

  /** styles.width */
  width: PropTypes.string,

  /** styles.minWidth */
  minWidth: PropTypes.string,

  /** styles.maxWidth */
  maxWidth: PropTypes.string,

  /** display: flex */
  dFlex: PropTypes.bool,

  /** flex-direction: column */
  dFlexCol: PropTypes.bool,

  /** justify-content/align-item: center */
  center: PropTypes.bool,

  /** justify-content: center */
  justConCenter: PropTypes.bool,

  /** justify-content: flex-end */
  justConEnd: PropTypes.bool,

  /** justify-content: space-between */
  justConBetween: PropTypes.bool,

  /** align-item: center */
  alignItCenter: PropTypes.bool,

  /** align-item: flex-end */
  alignItEnd: PropTypes.bool,

  /** The fragment supports raised style */
  raised: PropTypes.bool,

  /** The fragment supports shadowed style */
  shadowed: PropTypes.bool,

  /** The fragment supports dark mode */
  dark: PropTypes.bool,

  /** The fragment can fade in */
  fadeIn: PropTypes.bool,

  /** The fragment can be sticky */
  sticky: PropTypes.bool,

  /** The `top` css attribute (in `px`) for the fragment element */
  offsetTop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * The padding css attribute
   * @example
   * <CTFragment padding="10" ... /> // padding: 10px;
   * <CTFragment padding={30} ... /> // padding: 30px;
   * <CTFragment padding={[10,5]} ... /> // padding: 10px 5px;
   * <CTFragment padding={[20,30,40,50]} ... /> // padding: 20px 30px 40px 50px;
   */
  padding: PropTypes.oneOfType([
    CSSTypes,
    PropTypes.arrayOf(CSSTypes)
  ]),

  /**
   * The margin css attribute
   * @example
   * <CTFragment margin="10" ... /> // margin: 10px;
   * <CTFragment margin={30} ... /> // margin: 30px;
   * <CTFragment margin={[10,5]} ... /> // margin: 10px 5px;
   * <CTFragment margin={[20,30,40,50]} ... /> // margin: 20px 30px 40px 50px;
   */
  margin: PropTypes.oneOfType([
    CSSTypes,
    PropTypes.arrayOf(CSSTypes)
  ]),

  /**
   * The border-radius css attribute
   * @example
   * <CTFragment borderRadius="10" ... /> // border-radius: 10px;
   * <CTFragment borderRadius={30} ... /> // border-radius: 30px;
   * <CTFragment borderRadius={[10,5]} ... /> // border-radius: 10px 5px;
   * <CTFragment borderRadius={[20,30,40,50]} ... /> // border-radius: 20px 30px 40px 50px;
   */
  borderRadius: PropTypes.oneOfType([
    CSSTypes,
    PropTypes.arrayOf(CSSTypes)
  ]),

  /** True if is bordered */
  bordered: PropTypes.bool,

  /** True if has a top border */
  borderTop: PropTypes.bool,

  /** True if has a right border */
  borderRight: PropTypes.bool,

  /** True if has a bottom border */
  borderBottom: PropTypes.bool,

  /** True if has a left border */
  borderLeft: PropTypes.bool,

  /** True if overflow: hidden; */
  overflowHidden: PropTypes.bool,

  /** True if overflow-y: auto */
  scrollY: PropTypes.bool,

  /** True if overflow-x: auto */
  scrollX: PropTypes.bool,
};

export default CTFragment;