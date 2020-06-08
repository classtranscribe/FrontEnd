import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuItem from './MenuItem';

function SettingsMenu(props) {
  let {
    open,
    getSettingsMenu,
    closeMenu
  } = props;

  const [currMenus, setCurrMenus] = useState(getSettingsMenu());
  const [canGoBack, setCanGoBack] = useState(false);
  const goBack = () => {
    setCurrMenus(getSettingsMenu());
    setCanGoBack(false);
  };

  const toMenu = menus => {
    setCurrMenus(menus);
    setCanGoBack(true);
  }

  useEffect(() => {
    goBack();
  }, [open]);


  return open ? (
    <ClickAwayListener 
      role="menu"
      onClickAway={closeMenu}
    >
      <div className="ctp settings-menu-con" data-scroll="light">
        {
          canGoBack
          &&
          <button 
            className="plain-btn ctp settings-menuitem go-back-btn"
            onClick={goBack}
          >
            <span className="left">
              <span className="ctp check-icon checked">
                <i className="material-icons">chevron_left</i>
              </span>
              <span className="ctp menuitem-text">
                Back
              </span>
            </span>
          </button>
        }

        <div className="ctp settings-menu">
          {currMenus.map((menu, index) => (
            <MenuItem
              isFirst={index === 0}
              item={menu}
              setMenus={toMenu}
              onClose={goBack}
            />
          ))}
        </div>
      </div>
    </ClickAwayListener>
  ) : null;
}

SettingsMenu.propTypes = {

};

export default SettingsMenu;

