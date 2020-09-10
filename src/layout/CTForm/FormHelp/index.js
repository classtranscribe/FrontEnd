import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import CTFragment from '../../CTFragment';

const useStyles = makeStyles({
  standardInfo: {
    background: '#f2fafa',
    marginBottom: '20px',
    '& .MuiAlert-icon': {
      color: '#348b86 !important'
    }
  },
  message: {
    '& .MuiAlertTitle-root': {
      fontWeight: 'bold',
      textTransform: 'uppercase'
    }
  }
});

/**
 * An instruction block component used in `CTForm`
 */
function FormHelp(props) {
  let {
    title,
    children,
    severity = 'info',
    ...otherProps
  } = props;

  const classes = useStyles();

  return (
    <CTFragment {...otherProps}>
      <Alert severity={severity} classes={classes}>
        {Boolean(title) && <AlertTitle>{title}</AlertTitle>}
        {children}
      </Alert>
    </CTFragment>
  );
}

FormHelp.propTypes = {
  ...CTFragment.propTypes,
  
  /** Title of the help */
  title: PropTypes.node,

  /** The primary content */
  children: PropTypes.node,

  severity: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
};

export default FormHelp;

