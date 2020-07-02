import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import SettingsIcon from '@material-ui/icons/Settings';
import { links } from 'utils/links';
import { useStyles } from './CourseAnalyticsButton';

function CourseSettingsButton(props) {
  const { offeringId } = props;

  const buttonClasses = useStyles();

  return (
    <Button
      component={Link}
      className={cx(buttonClasses.button, 'mb-2')}
      startIcon={<SettingsIcon />}
      size="large"
      to={links.courseSettings(offeringId)}
    >
      settings
    </Button>
  );
}

CourseSettingsButton.propTypes = {
  offeringId: PropTypes.string
};

export default CourseSettingsButton;

