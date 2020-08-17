import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { CTFragment, CTText } from 'layout';
import { Poster } from '../../Poster';
import { parseMedia } from './parse-media';
import './index.scss';

function MediaCard(props) {
  const {
    row,
    dark,
    id,
    name,
    href,
    ratio,
    isUnavailable,
    description,
    posterWidth = '250px',
    ...otherProps
  } = props;

  const cardClasses = cx('ct-media-card', { row, dark });
  const cardProps = {
    id,
    as: Link,
    to: href,
    className: cardClasses
  };

  return (
    <CTFragment {...cardProps} {...otherProps}>
      <Poster progress={ratio} width={posterWidth} />
      <div className="info-con">
        <CTText className="media-name" size="medium" bold line={2}>{name}</CTText>
        <CTText fluid muted line={2} margin={[3, 0, 0, 0]}>{description}</CTText>
      </div>
    </CTFragment>
  );
}

MediaCard.propTypes = {
  row: PropTypes.bool,
  dark: PropTypes.bool,
  id: PropTypes.string,
  name: PropTypes.string,
  href: PropTypes.string,
  ratio: PropTypes.number,
  isUnavailable: PropTypes.bool,
  description: PropTypes.string,
  posterWidth: PropTypes.string
};

MediaCard.parse = parseMedia;

export default MediaCard;
