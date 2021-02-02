import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { CTPopoverLabel } from 'layout';
import { epub } from '../../controllers';

function NavigationTrigger({ show, onToggle }) {
  const label = `${show ? 'Close' : 'Open' } Chapter Navigation (⌘B)`;
  
  return (
    <div className="ct-epb nav-trigger">
      <CTPopoverLabel label={label}>
        <IconButton
          aria-label={label}
          aria-expanded={show.toString()}
          aria-controls={epub.id.EPubNavigationMenuID}
          onClick={onToggle}
        >
          <span className="material-icons" aria-hidden="true">
            {show ? 'chevron_left' : 'list'}
          </span>
        </IconButton>
      </CTPopoverLabel>
    </div>
  );
}

export default NavigationTrigger;
