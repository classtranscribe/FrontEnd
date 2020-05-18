import React, { useRef, useState, useEffect } from 'react';
import classNames from 'classnames';
import { Button } from 'pico-ui';
import './index.scss';
import { util } from 'utils';

export function ScrollArea({
  id = null,
  className = null,
  scrollClassName = null,
  offsetTop = 0,
  scrollToTopButton = 'hide', // 'hide', 'top left', 'top right', 'bottom left', 'bottom right'
  scrollToTopButtonStyle = {},
  scrollBar = true,
  dark = false,
  smoothScroll = false,
  children = null,
  ...otherProps
}) {
  
  const scrollRef = useRef();
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    if (smoothScroll) {
      scrollRef.current.style.scrollBehavior = 'smooth';
    }

    if (scrollToTopButton !== 'hide') {
      scrollRef.current.addEventListener('scroll', function() {
        if (this.scrollTop <= offsetTop && this.isNotTop) {
          setIsTop(true);
          this.isNotTop = false;
        } else if (!this.isNotTop) {
          setIsTop(false);
          this.isNotTop = true;
        }
      });
    }
  }, []);

  const scrollToTop = () => util.elem.scrollToTop(scrollRef.current);

  let classes = classNames('ct-scroll-area-con', className);
  let scrollClasses = classNames('ct-scroll-area', scrollClassName);
  let scrollTopBtnClasses = classNames(
    'ct-sa-to-top-btn', 
    'ct-a-fade-in',
    scrollToTopButton,
    {
      'is-top': isTop 
    }
  );

  return (
    <div className={classes}>
      <div style={scrollToTopButtonStyle} className={scrollTopBtnClasses}>
        <Button round
          icon="arrow_upward"
          color={dark ? "teal" : "black"}
          onClick={scrollToTop}
        />
      </div>
      <div
        id={id}
        ref={scrollRef}
        data-scroll={scrollBar}
        className={scrollClasses}
        {...otherProps}
      >
        {children}
      </div>
    </div>
  );
}
