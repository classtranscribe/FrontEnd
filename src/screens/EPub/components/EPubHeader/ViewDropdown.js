import React, { useState, useRef } from 'react';
import Button from '@material-ui/core/Button';
import { CTDropdown } from 'layout';
import { epub, connectWithRedux } from '../../controllers';

function ViewDropdown({ view, dispatch }) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = () => setOpen(false);
  const handleChange = (value) => dispatch({type: 'epub/setView', payload: value}); 

  const viewOptions = [
    {
      value: epub.const.EpbReadOnly,
      text: 'View I-Note (Read Only)',
      icon: 'visibility'
    },{
      value: epub.const.EpbEditStructure,
      text: 'Edit I-Note Structure',
      icon: 'layers'
    },{
      value: epub.const.EpbEditChapter,
      text: 'Edit Chapters',
      icon: 'dashboard'
    },
    {
      value: epub.const.EditINote,
      text: 'Edit I-Note (beta)',
      icon: 'edit'
    }
  ];

  const currentView = viewOptions.find(vi => vi.value === view);

  return (
    <>
      <Button
        variant="outlined"
        id="ct-epb-view-dropdown-btn"
        ref={anchorRef}
        aria-controls={open ? 'ct-epb-view-menu' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        className="ct-epb view-dropdown-btn"
        startIcon={
          <span className="material-icons">{currentView.icon}</span>
        }
        endIcon={
          <span className="material-icons">arrow_drop_down</span>
        }
      >
        {currentView.text}
      </Button>
      <CTDropdown 
        id="ct-epb-view-menu"
        open={open}
        anchorRef={anchorRef}
        value={view}
        options={viewOptions}
        onClose={handleClose}
        onChange={handleChange}
      />
    </>
  );
}

export default connectWithRedux(
  ViewDropdown,
  ['view']
);
