import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { boxLogo, kalturaLogo } from 'assets/images';
import './index.scss';

const getColor = (type) => {
  switch (type) {
    case 0:
      return 'blue';
    case 1:
      return 'red';
    case 4:
      return 'blue';
    default:
      return 'black';
  }
};

const getIconName = (type) => {
  switch (type) {
    case 0:
      return 'play circle outline';
    case 1:
      return 'youtube';
    case 4:
      return 'box';
    default:
      return 'file video';
  }
};


/**
 * The icon component for playlists
 */
function CTPlaylistIcon(props) {
  const {
    type = 2,
    size = 'normal'
  } = props;

  const iconProps = {
    className: cx('ct-pl-icon', size),
    color: getColor(type),
    name: getIconName(type),
    // Flip the icon if the type is 0 -- Echo360
    flipped: type === 0 ? 'horizontally' : null,
    'aria-hidden': 'true'
  };

  const imgIconProps = {
    src: type === 4 ? boxLogo : kalturaLogo,
    className: cx('ct-pl-icon', size),
    'aria-hidden': 'true'
  };

  switch (type) {
    case 4:
    case 3:
      return <img {...imgIconProps} />;
    default:
      return <Icon {...iconProps} />;
  }
}

CTPlaylistIcon.propTypes = {
  /**
   * Source type of the playlist:
   * 0 - Echo360, 1 - YouTube, 2 - file, 3 - Kaltura,  4 - Box
   */
  type: PropTypes.oneOf([0, 1, 2, 3, 4]),

  /** Size of the icon -- 'small', 'normal', 'large', 'big' */
  size: PropTypes.oneOf(['small', 'normal', 'large', 'big'])
};

export default CTPlaylistIcon;

