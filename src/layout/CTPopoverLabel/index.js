import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

export const useStyles = makeStyles({
  tooltip: {
    backgroundColor: '#363636',
    fontSize: '13px'
  },
  arrow: {
    color: '#363636'
  }
});

function CTPopoverLabel(props) {
  const {
    children,
    label,
    placement,
    disabled
  } = props;

  const labelClasses = useStyles();

  return disabled ? children : (
    <Tooltip classes={labelClasses} title={label} placement={placement}>
      {children}
    </Tooltip>
  );
}

CTPopoverLabel.propTypes = {
  children: PropTypes.node,
  label: PropTypes.node,
  placement: PropTypes.string,
  disabled: PropTypes.bool
};

export default CTPopoverLabel;

