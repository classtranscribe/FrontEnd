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
  } = props;

  const labelClasses = useStyles();

  return (
    <Tooltip classes={labelClasses} title={label} placement={placement}>
      {children}
    </Tooltip>
  );
}

CTPopoverLabel.propTypes = {
  children: PropTypes.node,
  label: PropTypes.node,
  placement: PropTypes.string,
};

export default CTPopoverLabel;

