import React, { useState } from 'react';
import { links, timestr } from 'utils'
import ListItem from '@material-ui/core/ListItem';
import _ from 'lodash';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import Tooltip from '@material-ui/core/Tooltip';

export function SearchCard({ searchData = {} }) {
  // expand and show the list of captions for a media
  const [expand, setExpand] = useState(false);
  const handleExpand = () => { setExpand(!expand) };

  return (
    <Card id="ct-nh-search-card">
      <CardContent>
        <div className="ct-nh-search-appear-times">Mentioned {searchData.captions.length} times in</div>
        <CardActions>
          <div id="ct-nh-video-btn">{searchData.mediaName}</div>
          <div id="ct-nh-search-card-btn">
            <Tooltip title="Expand" arrow placement="top">
              <IconButton
                onClick={handleExpand}
                aria-expanded={expand}
                aria-label="show captions"
                disableRipple
              >
                {expand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Play" arrow placement="top">
              <IconButton
                disableRipple
                onClick={() => {
                  window.location = links.watch(searchData.mediaId);
                }}
                aria-label="play video"
              >
                <PlayCircleOutlineIcon />
              </IconButton>
            </Tooltip>
          </div>
        </CardActions>
        <Collapse in={expand} timeout="auto" unmountOnExit>
          {searchData.captions.map((cap) =>
            <Tooltip title={<div id="ct-nh-search-time">{cap.begin.substring(0, 8)}</div>} placement="left">
              <ListItem
                className="ct-nh-video-caption"
                button
                disableRipple
                onClick={
                  () => {
                    window.location = links.watch(
                      searchData.mediaId,
                      {
                        begin: timestr.toSeconds(cap.begin)
                      });
                  }
                }
              >
                {cap.text}
              </ListItem>
            </Tooltip>

          )}
        </Collapse>

      </CardContent>
    </Card>
  );
}
