import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import './index.scss';
import CTFragment from '../CTFragment';

/**
 * A controlled text component for ClassTranscribe
 */
function Text(props) {
  let {
    as = 'div',
    id,
    className,
    fluid,
    center,
    uppercase,
    capitalize,
    bold,
    underline,
    italic,
    muted,
    celadon,
    teal,
    highlighted,
    hoverUnderlined,
    hoverTeal,
    hoverHighlighted,
    margin,
    padding,
    size = 'normal', // small, normal, large, huge
    line,
    children,
    ...otherProps
  } = props;

  const limitedLine = Boolean(line);

  const textClasses = cx('ct', 'ct-text', size, {
    fluid,
    uppercase,
    capitalize,
    bold,
    underline,
    italic,
    center,
    muted,
    teal,
    celadon,
    highlighted,
    hoverUnderlined,
    hoverTeal,
    hoverHighlighted,
    limitedLine,
  }, className);

  const textStyle = {
    WebkitLineClamp: `${line }`
  };

  const textProps = {
    id,
    as,
    className: textClasses,
    styles: textStyle,
    margin,
    padding
  };

  return (
    <CTFragment {...textProps} {...otherProps}>
      {children}
    </CTFragment>
  );  
}

Text.propTypes = {
  /**
   * A HTML tag name for this fragment, default as `div`
   * @example
   * <CTFragment as="a" ... >...</CTFragment> // <a ... >...</a>
   * <CTFragment as="ul" ... >...</CTFragment> // <ul ... >...</ul>
   */
  as: CTFragment.propTypes.as,

  /** An unique id to the text */
  id: PropTypes.string,

  /** Additional classes */
  className: PropTypes.string,

  /** The text can be fluid to the container */
  fluid: PropTypes.bool,

  /** The text can be at center */
  center: PropTypes.bool,

  /** The text can be transformed to uppercase */
  uppercase: PropTypes.bool,

  /** The text can be transformed to capitalized */
  capitalize: PropTypes.bool,

  /** The text can be bold */
  bold: PropTypes.bool,

  /** The text can have a muted color */
  muted: PropTypes.bool,

  /** The text can have a celadon color */
  celadon: PropTypes.bool,

  /** The text can have a teal color */
  teal: PropTypes.bool,

  /** The text can have a highlighted color */
  highlighted: PropTypes.bool,

  /** Underline the text when mouse over */
  hoverUnderlined: PropTypes.bool,

  /** Set color to be `teal` when mouse over */
  hoverTeal: PropTypes.bool,

  /** Highlight the text when mouse over */
  hoverHighlighted: PropTypes.bool,

  /**
   * you can set margin of the text, 
   * See CTFragment.propTypes.margin for more usage
   */
  margin: CTFragment.propTypes.margin,

  /**
   * you can set padding of the text
   * See CTFragment.propTypes.margin for more usage
   */
  padding: CTFragment.propTypes.padding,

  /**
   * The text can have a different sizes
   * from 'normal', 'medium', 'big', 'large', 'huge'
   */
  size: PropTypes.oneOf(['normal', 'medium', 'big', 'large', 'huge']),

  /**
   * You can limit the number of line you want to display,
   * the overflowed the text will be `ellipsis`
   */
  line: PropTypes.number,

  /** The primary content of the text */
  children: PropTypes.node,
};

export default Text;
