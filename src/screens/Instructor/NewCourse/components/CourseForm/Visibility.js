import React from 'react';
import {
  CTFragment,
  CTFormHeading,
  CTFormRow,
  CTSelect,
  CTSwitch
} from 'layout';
import { api, _getSelectOptions } from 'utils';
import PublishStatus from 'entities/PublishStatus';

function Visibility({
  accessType,
  logEventsFlag,
  publishStatus,
  setAccess,
  setLogEventsFlag,
  setPublishStatus,
}) {
  const handleVisibilityChange = ({ target: { value } }) => {
    setAccess(value);
  };

  const handleLogEventsFlagChange = ({ target: { checked } }) => {
    setLogEventsFlag(checked);
  };

  const handlePublishStatusChange = ({ target: { checked } }) => {
    setPublishStatus(checked ? PublishStatus.Published : PublishStatus.Unpublished);
  };

  const visibilityOptions = api.offeringAccessType.slice(1).map(type => ({
    text: type.name,
    value: type.id,
    description: type.description
  }));

  return (
    <CTFragment>
      <CTFormHeading>Visibility</CTFormHeading>

      <CTFormRow maxWidth="600px">
        <CTSelect
          required
          id="visibility-sel"
          label="Visibility"
          helpText="Choose the user group of this course."
          defaultValue="0"
          options={visibilityOptions}
          value={accessType}
          onChange={handleVisibilityChange}
        />
      </CTFormRow>

      <CTFormRow>
        <CTSwitch
          id="publish-switch"
          label="Publish the course"
          checked={publishStatus === 0}
          onChange={handlePublishStatusChange}
          helpText="By publishing, this course will be visible to desired user group."
        />
      </CTFormRow>

      <CTFormRow>
        <CTSwitch
          id="log-event-switch"
          label="Receive the statistics of students' performance in the future"
          checked={logEventsFlag}
          onChange={handleLogEventsFlagChange}
          helpText="By switching on, we will log students'/viewers' performance for this course."
        />
      </CTFormRow>
    </CTFragment>
  );
}

export default Visibility;
