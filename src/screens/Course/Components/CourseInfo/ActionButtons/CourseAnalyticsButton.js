import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import BarChartIcon from '@material-ui/icons/BarChart';
import { makeStyles } from '@material-ui/core/styles';
import { links } from 'utils/links';

export const useStyles = makeStyles({
  button: {
    fontWeight: 'bold',
    '&:hover': {
      color: 'teal'
    }
  }
});

function CourseAnalyticsButton(props) {
  const { offeringId } = props;

  const buttonClasses = useStyles();

  return (
    <Button 
      component={Link}
      className={cx(buttonClasses.button, 'mb-2')}
      startIcon={<BarChartIcon />} 
      size="large" 
      to={links.courseAnalytics(offeringId)}
    >
      analytics
    </Button>
  );
}

CourseAnalyticsButton.propTypes = {
  offeringId: PropTypes.string
};

export default CourseAnalyticsButton;

