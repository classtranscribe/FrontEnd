import React, { useState, useEffect, useContext } from 'react';
import { CTFragment, CTFormHeading, CTFormRow, CTInput, CTSelect, CTCheckbox } from 'layout';
import { api, util, user } from 'utils';

function PlaylistType() {
  const [option, setOption] = useState('opt-1');
  const handleSelect = ({ target: { value } }) => setOption(value);

  const typeOptions = [
    { value: 'opt-1', text: 'Upload', description: 'Manually upload videos' },
    { value: 'opt-2', text: 'Echo360', description: 'Host videos from Echo360' },
    { value: 'opt-3', text: 'YouTube', description: 'Host videos from YouTube playlist' },
    {
      value: 'opt-4',
      text: 'Kaltura/MediaSpace',
      description: 'Host videos from Kaltura/MediaSpace',
    },
    { value: 'opt-5', text: 'Box', description: 'Host videos from a Box folder' },
  ];

  return (
    <CTFragment>
      {/* Selection */}
      <CTFormHeading>PLAYLIST TYPE</CTFormHeading>

      <CTFormRow>
        <CTSelect
          id="sel-1"
          label="Selection"
          defaultValue="opt-1"
          options={typeOptions}
          value={option}
          onChange={handleSelect}
        />
      </CTFormRow>
    </CTFragment>
  );
}
export default PlaylistType;
