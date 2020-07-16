import React from 'react';
import { Menu, Typography, MenuItem } from '@material-ui/core';

const styles = {
  menu: {
    backgroundColor: '#ffffff', 
    color: 'rgb(236, 236, 236)',
    width: '280px'
  },
  icon: { 
    color: 'rgb(236, 236, 236)', 
    fontSize: '1.3rem' 
  },
  title: {
    color: '#d5dedf'
  },
  font: { 
    color: 'rgb(70, 70, 70)', 
    fontSize: '1.15rem'
  },
  currfont: { 
    color: 'black', 
    fontSize: '1.15rem',
    fontWeight: 'bold' 
  },
};

export function EPubMenu({
  trigger,
  anchorEl,
  setAnchorEl,
  value,
  handleItemClick,
  items=[],
}) {
  const onClose = () => setAnchorEl(null);
  
  const onClick = val => {
    handleItemClick(val);
    onClose();
  };

  return (
    <>
      {trigger}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        PaperProps={{style: styles.menu}}
      >
        {items.map( item => (
          <MenuItem
            key={item.text}
            aria-label={item.text}
            onClick={() => onClick(item.value)}
          >
            <Typography 
              style={
              item.style || 
              (
                item.value === value 
                ? styles.currfont 
                : styles.font
              )
            }
            >
              {item.text}
            </Typography>
          </MenuItem>
      ))}
      </Menu>
    </>
  );
}
