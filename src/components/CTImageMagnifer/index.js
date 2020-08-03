import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { SideBySideMagnifier } from 'react-image-magnifiers';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles({
  img: {
    width: '100%',
    overflow: 'hidden'
  }
});

function CTImageMagnifer(props) {
  const {
    id,
    className,
    src,
    alt
  } = props;

  const classes = useStyle();

  return (
    <SideBySideMagnifier
      id={id}
      className={cx(classes.img, className)}
      imageSrc={src}
      imageAlt={alt}
      largeImageSrc={src}
      alwaysInPlace
      fillAvailableSpace
    />
  );
}

CTImageMagnifer.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  src: PropTypes.string,
  alt: PropTypes.string
};

export default CTImageMagnifer;

