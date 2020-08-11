import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'pico-ui';
import { CTBrand } from '../CTNavHeader/CTBrand';

/**
 * A button controlling sidebar open/close on nav header
 */
function NavSidebarTrigger(props) {
  let {
    // showSidebar = true,
    logo = false,
    darkMode = false,
    withTrigger = true,
    linkDisabled = false,
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

      <CTBrand logo={logo} darkMode={darkMode} disabled={linkDisabled} />
    </div>
  )
}

NavSidebarTrigger.propTypes = {
  /** Determine use text-brand or logo */
  logo: PropTypes.bool,

  /** Determine if display the sidebar trigger */
  withTrigger: PropTypes.bool,

  /** The `CTLayout` supports the dark mode */
  darkMode: PropTypes.bool,

  /** True if the sidebar is open */
  showSidebar: PropTypes.bool,

  /** Handle sidebar trigger click */
  onSidebarTriggerClick: PropTypes.func
};

export default NavSidebarTrigger;
