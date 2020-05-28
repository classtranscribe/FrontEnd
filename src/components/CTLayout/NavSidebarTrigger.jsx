import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'pico-ui';
import { CTBrand } from './CTNavHeader/CTBrand';

/**
 * A button controlling sidebar open/close on nav header
 */
function NavSidebarTrigger(props) {
  let {
    withTrigger = true,
    darkMode = false,
    showSidebar = true,
    onSidebarTriggerClick,
  } = props;

  return (
    <div className="ct-nav-header-sb-trigger-con">
      {
        withTrigger
        &&
        <Button
          round
          icon="menu"
          color="transparent"
          onClick={onSidebarTriggerClick}
        />
      }

      <CTBrand darkMode={darkMode} />
    </div>
  )
}

NavSidebarTrigger.propTypes = {
  /** The `CTLayout` supports the dark mode */
  darkMode: PropTypes.bool,

  /** True if the sidebar is open */
  showSidebar: PropTypes.bool,

  /** Handle sidebar trigger click */
  onSidebarTriggerClick: PropTypes.func
};

export default NavSidebarTrigger;
