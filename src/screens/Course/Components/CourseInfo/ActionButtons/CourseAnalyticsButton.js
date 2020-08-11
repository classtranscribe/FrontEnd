import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import BarChartIcon from '@material-ui/icons/BarChart';
import { links } from 'utils/links';
import { useButtonStyles } from 'layout';

function CourseAnalyticsButton(props) {
  const { offeringId } = props;

  const btn = useButtonStyles();

  return (
    <Button 
      component={Link}
      className={cx(btn.tealLink, 'mb-2')}
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

