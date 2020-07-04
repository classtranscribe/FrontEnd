import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { makeStyles } from '@material-ui/core/styles';
import { setup } from '../../../controllers';

export const useStyles = makeStyles({
  button: {
    fontWeight: 'bold',
    marginLeft: 5,
    minWidth: 'max-content',
    '&:not(.MuiButton-outlined)': {
      background: 'teal',
      color: 'white',
      '&:hover': {
        background: 'var(--ct-green-normal)',
      }
    }
  }
});

function StarButton(props) {
  const { isStarred } = props;

  const classes = useStyles();

  return (
    <Button 
      variant={isStarred ? 'outlined' : 'contained'}
      className={cx(classes.button, 'mb-2')} 
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

