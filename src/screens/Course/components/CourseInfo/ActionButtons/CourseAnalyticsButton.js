import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'dva/router';
import IconButton from '@material-ui/core/IconButton';
import BarChartIcon from '@material-ui/icons/BarChart';
import { links } from 'utils/links';
import { useButtonStyles, CTPopoverLabel } from 'layout';

function CourseAnalyticsButton(props) {
  const { offeringId } = props;

  const btn = useButtonStyles();

  return (
    <CTPopoverLabel label="Course Analytics">
      <IconButton 
        component={Link}
        className={cx(btn.tealLink, 'mb-2', 'p-2', 'ct-a-fade-in')}
        to={links.courseAnalytics(offeringId)}
      >
        <BarChartIcon />
      </IconButton>
    </CTPopoverLabel>
  );
}

CourseAnalyticsButton.propTypes = {
  offeringId: PropTypes.string
};

export default CourseAnalyticsButton;

