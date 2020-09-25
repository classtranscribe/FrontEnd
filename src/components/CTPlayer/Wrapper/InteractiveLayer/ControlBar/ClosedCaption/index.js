import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

function ClosedCaption(props) {
  const {
    open,
    currCaption,
    ccStyle,
  } = props;

  const {
    fontSize,
    fontColor,
    opacity,
    backgroundColor
  } = ccStyle;

  const ccTextStyles = {
    fontSize: `${fontSize + 0.2 }em`,
    color: fontColor
  };

  const ccBGStyles = {
    opacity,
    background: backgroundColor
  };

  return (currCaption && open) ? (
    <div className="ctp closed-caption">
      <span className="cc-bg" style={ccBGStyles} />

      <span className="cc-text" style={ccTextStyles}>
        {currCaption.text}
      </span>
    </div>
  ) : null;
}

ClosedCaption.propTypes = {
  open: PropTypes.bool,
  currCaption: PropTypes.any,
  ccStyle: PropTypes.shape({
    fontSize: PropTypes.number,
    fontColor: PropTypes.string,
    opacity: PropTypes.number,
    backgroundColor: PropTypes.string
  })
};

export default ClosedCaption;

