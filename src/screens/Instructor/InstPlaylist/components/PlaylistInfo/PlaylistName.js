import React from 'react';
import { CTFragment, CTHeading, CTInput } from 'layout';
import { CTPlaylistIcon } from 'components';

function PlaylistName({
  editing,
  name,
  createdAt,
  sourceType,
  sourseURL,
  inputValue,
  handleRename,
  onInputChange
}) {
  const plIconElem = <CTPlaylistIcon type={sourceType} size="big" />;

  return editing ? (
    <CTFragment padding={[20, 20, 0, 20]}>
      <CTInput
        autoFocus
        label="Playlist Name"
        placeholder={name}
        value={inputValue}
        onChange={onInputChange}
        onReturn={handleRename}
      />
    </CTFragment>
  ) : (
    <>
      <CTHeading icon={plIconElem} className="pl-name">
        {name}
      </CTHeading>
      <hr />
      <CTFragment list role="list" className="details">
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
            <span className="pl-2">{sourseURL}</span>
          </div>
        }
      </CTFragment>
    </>
  );
}

export default PlaylistName;
