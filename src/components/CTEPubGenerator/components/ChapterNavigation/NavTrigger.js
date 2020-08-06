import React from 'react';
import { Button } from 'pico-ui';
import { CTPopoverLabel } from 'layout';
import { epub } from '../../controllers';

function NavTrigger({ open }) {
  const label = `${open ? 'Close' : 'Open' } Chapter Menu`;

  return (
    <CTPopoverLabel label={label} placement="top">
      <div className="ct-epb ch-nav-ctrl-btn-con">
        <Button
          round
          icon={open ? 'chevron_left' : 'list'}
          color='teal'
          className="ct-epb ch-nav-ctrl-btn shadow-btn"
          onClick={open ? epub.nav.closeNavigator : epub.nav.showNavigator}
          aria-label={label}
        />
      </div>
    </CTPopoverLabel>
  );
}

export default NavTrigger;
