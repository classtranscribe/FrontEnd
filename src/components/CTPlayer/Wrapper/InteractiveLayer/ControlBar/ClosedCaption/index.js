import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

function ClosedCaption(props) {
  const {
    open,
    currCaption,
    ccFontSize,
    ccFontColor,
    ccOpacity,
    ccBackgroundColor,
  } = props;

  const ccTextStyles = {
    fontSize: `${ccFontSize + 0.2 }em`,
    color: ccFontColor,
  };

  const ccBGStyles = {
    background: ccBackgroundColor,
    opacity: ccOpacity,
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
  ccFontSize: PropTypes.number,
  ccFontColor: PropTypes.string,
  ccOpacity: PropTypes.number,
  ccBackgroundColor: PropTypes.string
};

export default ClosedCaption;

