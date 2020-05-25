import React, { useRef, useState, useEffect } from 'react';
import classNames from 'classnames';
import { Button } from 'pico-ui';
import './index.scss';
import { util } from 'utils';

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
      addScrollEventListener(scrollRef.current, offsetTop, setIsTop);
    }
  }, []);

  const scrollToTop = () => util.elem.scrollToTop(scrollRef.current);

  const classes = classNames('ct-scroll-area-con', className);
  const scrollClasses = classNames('ct-scroll-area', scrollClassName);
  const scrollTopBtnClasses = classNames('ct-sa-to-top-btn', 'ct-a-fade-in', scrollToTopButton, {
    'is-top': isTop,
  });

  return (
    <div className={classes}>
      <div style={scrollToTopButtonStyle} className={scrollTopBtnClasses}>
        <Button round icon="arrow_upward" color={dark ? 'teal' : 'black'} onClick={scrollToTop} />
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
