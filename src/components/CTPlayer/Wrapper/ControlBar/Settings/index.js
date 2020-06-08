import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ActionButton from '../../ActionButton';
import SettingsMenu from './Menus';
import './index.scss';

function Settings(props) {
  let { menus, getSettingsMenu } = props;

  const settingsMenus = getSettingsMenu();

  const [openMenu, setOpenMenu] = useState(false);
  const toggleOpenMenu = () => {
    setOpenMenu(om => !om);
  };

  return (
    <div className="ctp settings-root">
      <ActionButton
        icon={<i className="fas fa-cog" />}
        label="Settings"
        onClick={toggleOpenMenu}
        aria-haspopup="true"
      />

      <SettingsMenu 
        open={openMenu}
        menus={settingsMenus} 
        getSettingsMenu={getSettingsMenu}
        closeMenu={toggleOpenMenu} 
      />
    </div>
  );
}

Settings.propTypes = {

};

export default Settings;

