import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { makeStyles } from '@material-ui/core/styles';
import { setup } from '../../../controllers';

export const useStyles = makeStyles({
  button: {
    fontWeight: 'bold',
    marginLeft: 5
  }
});

function StarButton(props) {
  const { isStarred } = props;

  const buttonClasses = useStyles();

  return (
    <Button 
      variant={isStarred ? 'outlined' : 'contained'}
      className={buttonClasses.button} 
      startIcon={isStarred ? <StarBorderIcon /> : <StarIcon />}
      size="large"
      onClick={isStarred ? setup.unstar : setup.star}
    >
      {isStarred ? 'Unstar' : 'Star'}
    </Button>
  );
}

StarButton.propTypes = {
  isStarred: PropTypes.bool
};

export default StarButton;

