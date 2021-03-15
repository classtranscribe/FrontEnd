import React from 'react';
import { CTFragment, CTHeading, CTInput, CTInputChip } from 'layout';
import { CTPlaylistIcon } from 'components';

function PlaylistName({
  editing,
  name,
  createdAt,
  sourceType,
  sourseURL,
  inputValue,
  onInputChange,
  phraseList,
  handleAddChip,
  handleDeleteChip
}) {
  const plIconElem = <CTPlaylistIcon type={sourceType} size="big" />;

  return editing ? (
    <>
      <CTFragment padding={[20, 0, 0, 0]}>
        <CTInput
          autoFocus
          label="Playlist Name"
          placeholder={name}
          value={inputValue}
          onChange={onInputChange}
        />
      </CTFragment>
      <CTFragment padding={[20, 0, 0, 0]}>
        <CTInputChip
          label="Phrase List"
          sort={true}
          value={phraseList}
          onAdd={handleAddChip}
          onDelete={handleDeleteChip}
        />
      </CTFragment>
    </>
  ) : (
    <>
      <CTHeading fadeIn={false} icon={plIconElem} className="pl-name">
        {name}
      </CTHeading>
      <hr />
      <CTFragment dFlexCol role="list" className="details">
        {
          createdAt
          &&
          <div role="listitem">
            <b>CREATED AT</b>
            <span className="pl-2">{createdAt.slice(0, 10)}</span>
          </div>
        }
        {
          sourseURL
          &&
          <div role="listitem">
            <b>SOURCE</b>
            <span className="pl-2 text-break">{sourseURL}</span>
          </div>
        }
      </CTFragment>
    </>
  );
}

export default PlaylistName;
