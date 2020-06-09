import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

function ClosedCaption(props) {
  const { open, currCaption } = props;

  return (currCaption && open) ? (
    <div className="ctp closed-caption">
      {currCaption.text}
    </div>
  ) : null;
}

ClosedCaption.propTypes = {

};

export default ClosedCaption;

