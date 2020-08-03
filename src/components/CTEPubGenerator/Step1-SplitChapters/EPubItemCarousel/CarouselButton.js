import React from 'react';
import Button from '@material-ui/core/Button';
import { useButtonStyles } from 'layout';

function CarouselButton({
  children,
  startIcon,
  endIcon,
  onClick,
  outlined,
  ...otherProps
}) {
  const btn = useButtonStyles();

  return (
    <Button
      onClick={onClick}
      startIcon={startIcon}
      endIcon={endIcon}
      className={btn.teal}
      variant={outlined ? "outlined" : "contained"}
      size="large"
      {...otherProps}
    >
      {children}
    </Button>
  );
}

export default CarouselButton;
