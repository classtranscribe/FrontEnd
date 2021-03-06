import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'dva/router';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import { links } from 'utils/links';
import { useButtonStyles, CTPopoverLabel } from 'layout';

function CourseSettingsButton(props) {
  const { offeringId } = props;

  const btn = useButtonStyles();

  return (
    <CTPopoverLabel label="Course Settings">
      <IconButton
        component={Link}
        className={cx(btn.tealLink, 'mb-2', 'p-2', 'ct-a-fade-in')}
        to={links.courseSettings(offeringId)}
      >
        <SettingsIcon />
      </IconButton>
    </CTPopoverLabel>
  );
}

CourseSettingsButton.propTypes = {
  offeringId: PropTypes.string
};

export default CourseSettingsButton;

