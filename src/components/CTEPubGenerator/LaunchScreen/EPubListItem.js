import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { CTPlayerConstants as PConstants } from '../../CTPlayer';
import { epub } from '../controllers';

function EPubListItem({ epubItem, divider }) {
  const handleClick = () => {
    epub.list.changeEPub(epubItem);
  };

  return (
    <ListItem button divider={divider} onClick={handleClick}>
      <ListItemIcon>
        <span className="material-icons">text_snippet</span>
      </ListItemIcon>
      <ListItemText 
        primary={epubItem.title}
        secondary={`${PConstants.LANG_MAP[epubItem.language]}`}
      />
    </ListItem>
  );
}

export default EPubListItem;
