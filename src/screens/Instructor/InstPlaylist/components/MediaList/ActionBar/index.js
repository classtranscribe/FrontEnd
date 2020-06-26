import React from 'react';
import { Button } from 'pico-ui';
import { CTFragment, CTFilterInput } from 'layout';
import SelectionButton from './SelectionButton';

function ActionBar({
  selecting,
  selectAll,
  removeAll,
  isSelectedAll,
  filterValue,
  handleFilterChange
}) {
  return (
    <CTFragment vCenter className="ipl-media-actions" padding={[0, 10, 5, 23]}>
      <SelectionButton
        selecting={selecting}
        isSelectedAll={isSelectedAll}
        selectAll={selectAll}
        removeAll={removeAll}
      />
      
      {
        selecting
        &&
        <Button
          uppercase
          icon="delete"
          color="red transparent"
          text="Delete"
          classNames="mr-2"
          // onClick={handleDeleteVideos}
        />
      }

      <CTFilterInput
        grey
        value={filterValue}
        padding={[0]}
        placeholder="Filter videos ..."
        onInputChange={handleFilterChange}
      />

    </CTFragment>
  );
}

export default ActionBar;