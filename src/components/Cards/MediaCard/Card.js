import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Link } from 'dva/router';
import { CTFragment, CTText, makeEl, altEl } from 'layout';
import MediaPoster from './Poster';
import { parseMedia } from './parse-media';
import './index.scss';

const _posterSizes = {
  'small': '110px',
  'normal': '150px',
  'medium': '170px',
  'big': '250px'
};

function MediaCard(props) {
  const {
    row,
    dark,
    id,
    name,
    href = '',
    ratio,
    isUnavailable,
    label,
    description,
    nameSize = 'medium',
    posterSize,
    duration,
    ...otherProps
  } = props;

  const cardClasses = cx('ct-media-card', { row, dark });
  const cardProps = {
    id,
    as: Link,
    to: {pathname: href, search: '', hash: ''},
    className: cardClasses,
    role: 'listitem',
    title: name
  };

  const mediaNameElement = makeEl(CTText, {
    bold: true,
    size: nameSize,
    line: 2,
    className: 'media-name',
    children: name
  });

  const labelElement = altEl(CTText, Boolean(label), {
    bold: true,
    teal: true,
    children: label
  });

  const descripElement = altEl(CTText, Boolean(description), {
    line: 2,
    fluid: true,
    muted: true,
    margin: [3, 0, 0, 0],
    children: description,
    className: 'media-description'
  });

  const posterWidth = _posterSizes[posterSize] || _posterSizes.big;

  return (
    <CTFragment {...cardProps} {...otherProps}>
      <MediaPoster progress={ratio} width={posterWidth} duration={duration} />
      <div className="info-con">
        {mediaNameElement}
        {labelElement}
        {descripElement}
      </div>
    </CTFragment>
  );
}

MediaCard.propTypes = {
  row: PropTypes.bool,
  dark: PropTypes.bool,
  id: PropTypes.string,
  name: PropTypes.node.isRequired,
  href: PropTypes.string,
  ratio: PropTypes.number,
  isUnavailable: PropTypes.bool,
  description: PropTypes.node,
  duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.node,
  /** Size for the media name, one of 'normal', 'medium', 'big', 'large', 'huge' */
  nameSize: CTText.propTypes.size,
  /** Size of the poster, one of 'small', 'medium', 'big' */
  posterSize: PropTypes.oneOf(['small', 'normal', 'medium', 'big'])
};

MediaCard.parse = parseMedia;

export default MediaCard;
