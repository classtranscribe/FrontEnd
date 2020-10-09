import React from 'react';
import PropTypes from 'prop-types';
import { CTFragment } from 'layout';
import { CopyButton } from 'components';
import { links } from 'utils';
import CourseAnalyticsButton from './CourseAnalyticsButton';
import CourseSettingsButton from './CourseSettingsButton';
import InstModeCheckBox from './InstModeCheckBox';
import StarButton from './StarButton';

function ActionButtons(props) {
  const {
    show = false,
    isInsructor = false,
    isInstMode = false,
    offering,
    starredOfferings = [],
  } = props;

  const isStarred = Boolean(starredOfferings[offering.id]);
  const hasAnalytics = isInstMode && offering.logEventsFlag;
  const shareableURL = window.location.origin + links.course(offering.id);

  return show ? (
    <>
      <CTFragment justConEnd className="cp-action-bar">
        {isInsructor && <InstModeCheckBox isInstMode={isInstMode} />}
      </CTFragment> 

      <CTFragment
        alignItCenter
        borderTop
        padding={[10, 0, 10, 0]}
        className="cp-action-bar"
      >
        {hasAnalytics && <CourseAnalyticsButton offeringId={offering.id} />}
        {isInstMode && <CourseSettingsButton offeringId={offering.id} />}

        <CopyButton 
          text={shareableURL} 
          className="mb-2 p-2"
          label="Copy Shareable URL"
        />

        <StarButton isStarred={isStarred} />
      </CTFragment>
    </>
  ) : null;
}

ActionButtons.propTypes = {
  show: PropTypes.bool,
  isInsructor: PropTypes.bool,
  offering: PropTypes.object,
  starredOfferings: PropTypes.object
};

export default ActionButtons;

