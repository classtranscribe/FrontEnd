import React from 'react';
import PropTypes from 'prop-types';
import { CTFragment } from 'layout';
import CourseAnalyticsButton from './CourseAnalyticsButton';
import CourseSettingsButton from './CourseSettingsButton';
import InstModeCheckBox from './InstModeCheckBox';
import StarButton from './StarButton';

function ActionButtons(props) {
  const {
    show = false,
    isInsructor = false,
    isInstMode = false,
    offeringId,
    starredOfferings = [],
  } = props;

  const isStarred = Boolean(starredOfferings[offeringId]);

  return show ? (
    <>
      {
      isInsructor
      &&
      <CTFragment hEnd>
        <InstModeCheckBox isInstMode={isInstMode} />
      </CTFragment> 
    }

      <CTFragment
        vCenter
        borderTop
        padding={[10, 0, 10, 0]}
        className="cp-action-bar"
      >
        {
        isInstMode
        &&
        <>
          <CourseAnalyticsButton offeringId={offeringId} />
          <CourseSettingsButton offeringId={offeringId} />
        </>
      }

        <StarButton isStarred={isStarred} />
      </CTFragment>
    </>
  ) : null;
}

ActionButtons.propTypes = {
  show: PropTypes.bool,
  isInsructor: PropTypes.bool,
  offeringId: PropTypes.string,
  starredOfferings: PropTypes.object
};

export default ActionButtons;

