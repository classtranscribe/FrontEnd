import React from 'react';
import { Button } from 'pico-ui';
import { CTPopoverLabel } from 'layout';

function SelectionButton({
  selecting,
  selectAll,
  removeAll,
  isSelectedAll
}) {
  const selBtnColor = isSelectedAll 
                    ? 'black' 
                    : selecting 
                    ? '' 
                    : 'transparent';

  const selBtnIcon = isSelectedAll 
                    ? 'check_box' 
                    : selecting 
                    ? 'indeterminate_check_box' 
                    : 'check_box_outline_blank';

  const selBtnLabel = selecting 
                    ? 'Remove All' 
                    : 'Select All'; 
  
  const handleSelBtnClick = () => {
    if (selecting) {
      removeAll();
    } else {
      selectAll();
    }
  };

  return (
    <CTPopoverLabel label={selBtnLabel} placement="top">
      <div aria-hidden="true">
        <Button
          round
          icon={selBtnIcon}
          color={selBtnColor}
          onClick={handleSelBtnClick}
          classNames="mr-2"
        />
      </div>
    </CTPopoverLabel>
  );
}

export default SelectionButton;