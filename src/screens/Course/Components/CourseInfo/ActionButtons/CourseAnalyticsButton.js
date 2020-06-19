import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import BarChartIcon from '@material-ui/icons/BarChart';
import { makeStyles } from '@material-ui/core/styles';
import { links } from 'utils/links';

export const useStyles = makeStyles({
  button: {
    fontWeight: 'bold',
    marginBottom: 5,
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
      className={buttonClasses.button} 
      startIcon={<BarChartIcon />} 
      size="large" 
      href={links.courseAnalytics(offeringId)}
    >
      analytics
    </Button>
  );
}

CourseAnalyticsButton.propTypes = {
  offeringId: PropTypes.string
};

export default CourseAnalyticsButton;

