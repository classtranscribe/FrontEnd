import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Languages } from '../../CTPlayer';
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
        secondary={`${Languages.decode(epubItem.language)}`}
      />
    </ListItem>
  );
}

export default EPubListItem;
