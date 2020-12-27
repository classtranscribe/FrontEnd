import React from 'react';
import PropTypes from 'prop-types';
import { CTFragment } from 'layout';
import { CopyButton, PublishStatusSwitch } from 'components';
import { links, user } from 'utils';
import PublishStatus from 'entities/PublishStatus';
import { setup } from '../../../controllers';
import CourseAnalyticsButton from './CourseAnalyticsButton';
import CourseSettingsButton from './CourseSettingsButton';
import InstModeCheckBox from './InstModeCheckBox';
import StarButton from './StarButton';

function ActionButtons(props) {
  const {
    isInsructor = false,
    isInstMode = false,
    offering,
    starredOfferings = [],
  } = props;

  const isStarred = Boolean(starredOfferings[offering.id]);
  const hasAnalytics = isInstMode && offering.logEventsFlag;
  const shareableURL = window.location.origin + links.course(offering.id);

  const onPublish = () => setup.updatePublishStatus(PublishStatus.Published);
  const onUnpublish = () => setup.updatePublishStatus(PublishStatus.Unpublished);

  return (
    <CTFragment>
      <CTFragment justConBetween alignItCenter className="cp-action-bar">
        {
          isInsructor
          &&
          <PublishStatusSwitch
            status={offering.publishStatus}
            targetName="course"
            onPublish={onPublish}
            onUnpublish={onUnpublish}
          />
        }
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

        {user.isLoggedIn && <StarButton isStarred={isStarred} />}
      </CTFragment>
    </CTFragment>
  )
}

ActionButtons.propTypes = {
  isInsructor: PropTypes.bool,
  offering: PropTypes.object,
  starredOfferings: PropTypes.object
};

export default ActionButtons;

