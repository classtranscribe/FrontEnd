import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

function MenuItem(props) {
  const { 
    text, 
    current,
    active = false,
    bordered = false,
    isSubMenu = false,
    goBack = false,
    onClick, 
  } = props;

  const menuItemClasses = cx('plain-btn', 'ctp', 'settings-menuitem', {
    'go-back': goBack,
    bordered,
    active
  });
  const checkIconClasses = cx('ctp', 'check-icon', { checked: (active || goBack) });

  return (
    <button 
      className={menuItemClasses}
      autoFocus={active} 
      onClick={onClick}
      role="menuitemradio"
      aria-checked={active.toString()}
      aria-haspopup={isSubMenu.toString()}
    >
      <span className="left">
        {
          (!isSubMenu || bordered)
          &&
          <span className={checkIconClasses} aria-hidden="true">
            {
              goBack
              ?
                <i className="material-icons">arrow_back_ios</i>
              :
                <i className="material-icons">check</i>
            }
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
          <span className="ctp right-arrow" aria-hidden="true">
            <i className="material-icons">arrow_forward_ios</i>
          </span>
        }
      </span>
    </button>
  );
}

MenuItem.propTypes = {
  text: PropTypes.string, 
  current: PropTypes.string,
  active: PropTypes.bool,
  bordered: PropTypes.bool,
  isSubMenu: PropTypes.bool,
  goBack: PropTypes.bool,
  onClick: PropTypes.func,
};

export default MenuItem;
