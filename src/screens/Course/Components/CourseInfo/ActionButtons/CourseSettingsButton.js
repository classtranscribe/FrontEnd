import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import SettingsIcon from '@material-ui/icons/Settings';
import { links } from 'utils/links';
import { useStyles } from './CourseAnalyticsButton';

function CourseSettingsButton(props) {
  const { offeringId } = props;

  const buttonClasses = useStyles();

  return (
    <Button
      className={buttonClasses.button}
      startIcon={<SettingsIcon />}
      size="large"
      href={links.courseSettings(offeringId)}
    >
      settings
    </Button>
  );
}

CourseSettingsButton.propTypes = {
  offeringId: PropTypes.string
};

export default CourseSettingsButton;

