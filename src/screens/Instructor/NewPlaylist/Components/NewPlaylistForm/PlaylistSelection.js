import React from 'react';
import { CTFragment, CTFormHeading, CTFormRow, CTSelect } from 'layout';
import { api } from 'utils';

function PlaylistType(props) {
  let { sourceType, setsourceType } = props;
  const handleSelect = ({ target: { value } }) => setsourceType(value);

  const typeOptions = api.playlistTypes.map(plType => ({
    value: plType.id,
    text: plType.name,
    description: plType.description
  }));

  return (
    <CTFragment>
      {/* Selection */}
      <CTFormHeading>PLAYLIST TYPE</CTFormHeading>

      <CTFormRow>
        <CTSelect
          id="pl-type-sel"
          label="Playlist Type"
          options={typeOptions}
          value={sourceType}
          onChange={handleSelect}
        />
      </CTFormRow>
    </CTFragment>
  );
}
export default PlaylistType;
