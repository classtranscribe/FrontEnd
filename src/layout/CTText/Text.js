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
    className,
    fluid,
    textCenter,
    textLeft,
    textRight,
    justified,
    indent,
    uppercase,
    capitalize,
    bold,
    underline,
    italic,
    muted,
    white,
    celadon,
    teal,
    highlighted,
    hoverUnderlined,
    hoverTeal,
    hoverHighlighted,
    size = 'normal', // small, normal, large, huge
    fontSize,
    line,
    children,
    ...otherProps
  } = props;

  const limitedLine = Boolean(line);

  const textClasses = cx('ct', 'ct-text', size, {
    fluid,
    textCenter,
    textLeft,
    textRight,
    justified,
    uppercase,
    capitalize,
    bold,
    underline,
    italic,
    white,
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
    WebkitLineClamp: line ? `${line }` : undefined
  };

  if (indent) {
    textStyle.textIndent = indent;
  }

  if (fontSize) {
    textStyle.fontSize = fontSize;
  }

  const textProps = {
    className: textClasses,
    styles: textStyle,
  };

  return (
    <CTFragment {...textProps} {...otherProps}>
      {children}
    </CTFragment>
  );  
}

Text.propTypes = {
  ...CTFragment.propTypes,
  /** The text can be fluid to the container */
  fluid: PropTypes.bool,

  /** text-align: center */
  textCenter: PropTypes.bool,

  /** text-align: left */
  textLeft: PropTypes.bool,

  /** text-align: right */
  textRight: PropTypes.bool,

  /** text-align: justify */
  justified: PropTypes.bool,

  /** text-indent: (indent) */
  indent: PropTypes.string,

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
   * The text can have a different sizes
   * from 'normal', 'medium', 'big', 'large', 'huge'
   */
  size: PropTypes.oneOf(['normal', 'medium', 'big', 'large', 'huge']),

  /** font-size: (fontSize) */
  fontSize: PropTypes.string,

  /**
   * You can limit the number of line you want to display,
   * the overflowed the text will be `ellipsis`
   */
  line: PropTypes.number,

  /** The primary content of the text */
  children: PropTypes.node,
};

export default Text;
