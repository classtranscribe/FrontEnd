import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

export const useStyles = makeStyles({
  tooltip: {
    backgroundColor: '#363636',
    fontSize: '1em'
  },
  arrow: {
    color: '#363636'
  }
});

function SliderTimeLabel(props) {
  const { 
    children, 
    open, 
    value, 
    placement = 'top' 
  } = props;

  const classes = useStyles();

  return (
    <Tooltip 
      classes={classes} 
      open={open} 
      enterTouchDelay={0} 
      placement={placement}
      title={value}
      arrow
    >
      {children}
    </Tooltip>
  );
}

SliderTimeLabel.propTypes = {
  children: PropTypes.element,
  open: PropTypes.bool,
  value: PropTypes.any,
  placement: PropTypes.string
};

export default SliderTimeLabel;

