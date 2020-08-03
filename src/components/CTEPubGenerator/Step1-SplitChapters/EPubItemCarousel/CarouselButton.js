import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles({
  button: {
    fontWeight: 'bold',
    '&:not(.MuiButton-outlined)': {
      background: 'teal',
      color: 'white',
      '&:hover': {
        background: 'var(--ct-green-normal)',
      }
    }
  }
});

function CarouselButton({
  children,
  startIcon,
  endIcon,
  onClick,
  outlined,
  ...otherProps
}) {
  const classes = useStyles();

  return (
    <Button
      onClick={onClick}
      startIcon={startIcon}
      endIcon={endIcon}
      className={classes.button}
      variant={outlined ? "outlined" : "contained"}
      size="large"
      {...otherProps}
    >
      {children}
    </Button>
  );
}

export default CarouselButton;
