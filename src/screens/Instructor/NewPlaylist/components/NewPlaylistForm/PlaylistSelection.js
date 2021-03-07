import React from 'react';
import PropTypes from 'prop-types';
import { CTFragment, CTFormHeading, CTFormRow, CTSelect } from 'layout';
import { api } from 'utils';
import { CTPlaylistIcon } from 'components';
import SourceTypeInstruction from './SourceTypeInstruction';

function PlaylistType(props) {
  let { error, enable, sourceType, setsourceType } = props;
  const handleSelect = ({ target: { value } }) => setsourceType(value);
  const emptyPlaylistType = error.includes('playlistType') && enable;

  const typeOptions = api.playlistTypes.map((plType) => ({
    value: plType.id,
    text: <><CTPlaylistIcon type={plType.id} size="small" />{plType.name}</>,
    description: plType.description,
  }));
  // <SourceTypeInstruction />
  return (
    <CTFragment>
      {/* Selection */}
      <CTFormHeading>Source</CTFormHeading>

      

      <CTFormRow>
        <CTSelect
          id="pl-type-sel"
          label="Playlist Type"
          options={typeOptions}
          value={sourceType}
          onChange={handleSelect}
          error={emptyPlaylistType}
          helpText={emptyPlaylistType ? 'Playlist Type is required.' : ''}
        />
      </CTFormRow>
    </CTFragment>
  );
}
PlaylistType.propTypes = {
  sourceType: PropTypes.number,
};

export default PlaylistType;
