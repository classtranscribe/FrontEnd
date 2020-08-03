import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { useButtonStyles } from 'layout';
import { setup } from '../../../controllers';

function StarButton(props) {
  const { isStarred } = props;

  const btn = useButtonStyles();

  return (
    <Button 
      variant={isStarred ? 'outlined' : 'contained'}
      className={cx(btn.teal, 'mb-2')} 
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

