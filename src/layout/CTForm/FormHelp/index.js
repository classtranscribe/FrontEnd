import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import { CTFragment } from '../../CTFragment';

const useStyles = makeStyles({
  root: {
    background: '#f2fafa',
    marginBottom: '20px'
  },
  icon: {
    color: '#348b86 !important'
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
export function FormHelp(props) {
  let {
    title,
    children,
    padding,
  } = props;

  const classes = useStyles();

  return (
    <CTFragment padding={padding}>
      <Alert severity="info" classes={classes}>
        {Boolean(title) && <AlertTitle>{title}</AlertTitle>}
        {children}
      </Alert>
    </CTFragment>
  );
}

FormHelp.propTypes = {
  /** Title of the help */
  title: PropTypes.node,

  /** The primary content */
  children: PropTypes.node,

  /** The padding to the `CTFragment` */
  padding: CTFragment.propTypes.padding
};

