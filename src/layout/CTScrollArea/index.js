import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'pico-ui';
import { elem } from 'utils/use-elem';
import './index.scss';

function addScrollEventListener(scrollEl, offsetTop, setIsTop) {
  scrollEl.addEventListener('scroll', function () {
    if (this.scrollTop <= offsetTop && this.isNotTop) {
      setIsTop(true);
      this.isNotTop = false;
    } else if (!this.isNotTop) {
      setIsTop(false);
      this.isNotTop = true;
    }
  });
}

/**
 * A controlled scrolling wrapper
 */
function CTScrollArea(props) {
  let {
    id,
    className,
    scrollClassName,
    offsetTop = 0,
    scrollToTopButton = 'hide', // 'hide', 'top left', 'top right', 'bottom left', 'bottom right'
    scrollToTopButtonStyle = {},
    scrollBar = true,
    dark = false,
    smoothScroll = false,
    children,
    disabled = false,
    ...otherProps
  } = props;

  const scrollRef = useRef();
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    if (smoothScroll) {
      scrollRef.current.style.scrollBehavior = 'smooth';
    }

    if (scrollToTopButton !== 'hide' && !disabled) {
      addScrollEventListener(scrollRef.current, offsetTop, setIsTop);
    }
  }, []);

  const scrollToTop = () => elem.scrollToTop(scrollRef.current);

  const classes = classNames('ct-scroll-area-con', className);
  const scrollClasses = classNames('ct-scroll-area', scrollClassName);
  const scrollTopBtnClasses = classNames('ct-sa-to-top-btn', 'ct-a-fade-in', scrollToTopButton, {
    'is-top': isTop,
  });

  const scrollProps = { 
    id,
    ref: scrollRef,
    className: scrollClasses
  };

  if (scrollBar && !disabled) {
    scrollProps['data-scroll'] = 'true';
  }

  return (
    <div className={classes}>
      {
        !disabled
        &&
        <div style={scrollToTopButtonStyle} className={scrollTopBtnClasses}>
          <Button round icon="arrow_upward" color={dark ? 'teal' : 'black'} onClick={scrollToTop} />
        </div>
      }

      <div {...scrollProps} {...otherProps}>
        {children}
      </div>
    </div>
  );
}

CTScrollArea.propTypes = {
  /** Id of the element */
  id: PropTypes.string,

  /** Classes of the container */
  className: PropTypes.string,

  /** Classes of scrollable area */
  scrollClassName: PropTypes.string,

  /** Offset number to determine is top or not */
  offsetTop: PropTypes.number,

  /** Position of the scroll to top button */
  scrollToTopButton: PropTypes.oneOf([
    'hide', 
    'top left', 
    'top right', 
    'bottom left', 
    'bottom right'
  ]),

  /** Styles for the scroll to top button */
  scrollToTopButtonStyle: PropTypes.any,

  /** Display the scroll bar */
  scrollBar: PropTypes.bool,

  /** CTScrollArea supports darkMode */
  dark: PropTypes.bool,

  /** CTScrollArea supports smooth scrolling */
  smoothScroll: PropTypes.bool,

  /** Primary element */
  children: PropTypes.node,

  /** Disable scrolling */
  disabled: PropTypes.bool,
};

export default CTScrollArea;
