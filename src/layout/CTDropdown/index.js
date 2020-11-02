import React from 'react';
import PropTypes from 'prop-types';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import './index.scss';

function CTDropdown(props) {
  const {
    id,
    open,
    anchorRef,
    role = "menu",
    onClose,
    onChange,
    value,
    options = [],
    openWhenClickWithin,
    ...otherProps
  } = props;

  const handleClose = (event) => {
    if (openWhenClickWithin 
        && anchorRef.current 
        && anchorRef.current.contains(event.target)) {
      return;
    }

    if (typeof onClose === 'function') onClose();
  };

  const handleChange = (_val) => () => {
    if (typeof onChange === 'function') {
      onChange(_val);
    }

    handleClose();
  }

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      handleClose();
    }
  }

  return (
    <Popper open={open} anchorEl={anchorRef.current} role={role} transition disablePortal>
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
        >
          <Paper className="ct-dropd-menu-con">
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList
                id={id}
                variant="selectedMenu"
                autoFocusItem={open}
                onKeyDown={handleListKeyDown}
                {...otherProps}
              >
                {options.map(opt => (
                  <MenuItem
                    onClick={handleChange(opt.value)}
                    selected={opt.value === value}
                    className="ct-dropd-menu-item"
                  >
                    {
                      typeof opt.icon === 'string'
                      ?
                        <ListItemIcon>
                          <span className="material-icons">{opt.icon}</span>
                        </ListItemIcon>
                      :
                      opt.icon
                      ?
                        <ListItemIcon>
                          {opt.icon}
                        </ListItemIcon>
                      :
                      null
                    }
                    <Typography variant="inherit">{opt.text}</Typography>
                  </MenuItem>
                ))}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
}

CTDropdown.propTypes = {
  id: PropTypes.string,
  open: PropTypes.bool,
  anchorRef: PropTypes.any,
  role: PropTypes.string,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.any,
  options: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.string,
    text: PropTypes.string,
    value: PropTypes.string
  })),
};


export default CTDropdown;
