import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

function MenuItem(props) {
  let { item, setMenus, onClose } = props;

  const { 
    menus, 
    onClick, 
    value, 
    text, 
    current,
    active = false
  } = item;

  const isSubMenu = Array.isArray(menus);
  const handleClick = () => {
    if (isSubMenu) {
      if (typeof setMenus === 'function') setMenus(menus);
    } else {
      if (typeof onClick === 'function') onClick(value);
      if (typeof onClose === 'function') onClose(value);
    }
  };

  const checkIconClasses = cx('ctp', 'check-icon', { checked: active });
  const rightArrowClasses = cx('ctp', 'right-arrow', { show: isSubMenu });

  return (
    <button 
      className="plain-btn ctp settings-menuitem"
      autoFocus={active} 
      onClick={handleClick}
      role="menuitemradio"
      aria-checked={active.toString()}
      aria-haspopup={isSubMenu.toString()}
    >
      <span className="left">
        {
          !isSubMenu
          &&
          <span className={checkIconClasses}>
            <i className="material-icons">check</i>
          </span>
        }
        <span className="ctp menuitem-text">
          {text}
        </span>
      </span>
      <span className="right">
        <span className="current-value">
          {current}
        </span>
        {
          isSubMenu
          &&
          <span className={rightArrowClasses}>
            <i className="material-icons">chevron_right</i>
          </span>
        }
      </span>
    </button>
  );
}

const menuItemPropType = {
  onClick: PropTypes.func, 
  value: PropTypes.any, 
  text: PropTypes.any,
  current: PropTypes.any,
  active: PropTypes.bool
};

MenuItem.propTypes = {
  item: PropTypes.shape({
    menus: PropTypes.arrayOf(PropTypes.shape(menuItemPropType)),
    ...menuItemPropType
  }), 
  setMenus: PropTypes.func,
  onClose: PropTypes.func
};

export default MenuItem;

