/**
 * @param {String|HTMLElement} elem - the html elem / elem's id
 * @returns {HTMLElement}
 */
function getElement(elem) {
  if (typeof elem === 'string') {
    return document.getElementById(elem);
  }
  return elem;
}

class ElementHandler {
  constructor() {
    this.exitFullScreen = this.exitFullScreen.bind(this);
    this.enterFullscreen = this.enterFullscreen.bind(this);
    this.getElement = getElement;
  }
  /**
   * Focus on the elem
   * @param {String} elemId the id of the html elem
   */
  focus(elemId) {
    const elem = document.getElementById(elemId);

    if (elem && typeof elem.focus === 'function') {
      elem.focus();
    }
  }

  /**
   * Scroll the elem into view based on its `id`
   * @param {String} elemId the id of the html elem
   * @param {Object} options options for scrolling
   * @param {Boolean} options.center true if scroll to center
   * @param {Boolean} options.nearest true if scroll to nearest
   * @param {Boolean} options.smooth true if scrolling smoothly
   * @param {Boolean} options.focus true if focus on the elem after scrolling into view
   * @param {Function} options.alternate get called if can't find the elem
   */
  scrollIntoView(
    elemId,
    options = {
      center: false,
      nearest: false,
      smooth: false,
      focus: false,
      alternate: null,
    },
  ) {
    const { center, nearest, smooth, alternate } = options;
    const shouldFocus = options.focus;

    const elem = document.getElementById(elemId);
    if (elem && typeof elem.scrollIntoView === 'function') {
      let block = 'start';
      if (center) block = 'center';
      else if (nearest) block = 'nearest';

      elem.scrollIntoView({
        block,
        behavior: smooth ? 'smooth' : 'auto',
      });

      if (shouldFocus && typeof elem.focus === 'function') {
        elem.focus();
      }
    } else if (typeof alternate === 'function') {
      alternate();
    }
  }

  /**
   * Scroll the elem into center
   * @param {String|HTMLElement} elem - the html elem / elem's id
   * @param {Object} options - options for scrolling
   * @param {Boolean} options.smooth - true if scrolling smoothly
   * @param {Boolean} options.focus - true if focus on the elem after scrolling into view
   * @param {Function} options.alternate - get called if can't find the elem
   */
  scrollIntoCenter(
    elem,
    options = {
      smooth: false,
      focus: false,
      alternate: null,
    },
  ) {
    this.scrollIntoView(elem, { center: true, ...options });
  }

  /**
   * Set the elem's `scrollTop` to zero
   * @param {String|HTMLElement} elem - the html elem / elem's id
   * @param {Object} options - options for scrolling
   * @param {Number} options.scrollTop - HTMLElement.scrollTop
   * @param {String} options.scrollElemId - scrollTop += scrollElem.offsetTop
   */
  scrollToTop(
    el,
    options = {
      scrollTop: 0,
      scrollElemId: null,
      smooth: false,
    },
  ) {
    let { scrollTop } = options;
    const { scrollElemId, smooth } = options;

    const elem = getElement(el);
    if (elem) {
      let scrollElem = null;
      if (scrollElemId) scrollElem = document.getElementById(scrollElemId);
      if (scrollElem) {
        scrollTop += scrollElem.offsetTop;
      }
      if (smooth) {
        elem.style.scrollBehavior = 'smooth';
      }
      elem.scrollTop = scrollTop;

      if (smooth) {
        elem.style.scrollBehavior = 'auto';
      }
    }
  }

  /**
   * Determine if an elem is scrolled into view
   * @param {String|HTMLElement} elem - the html elem / elem's id
   * @param {Number} offsetTop - offset top
   */
  isScrolledIntoView(el, offsetTop, completely) {
    const elem = getElement(el);
    if (elem && typeof elem.getBoundingClientRect === 'function') {
      const rect = elem.getBoundingClientRect();
      const elemTop = rect.top;
      const elemBottom = rect.bottom;

      let isVisible = false;
      if (completely) { // Only completely visible elements return true:
        isVisible = elemTop >= 0 && elemTop <= (offsetTop || window.innerHeight);
      } else { // Partially visible elements return true:
        isVisible = elemTop < window.innerHeight && elemBottom >= offsetTop;
      }
      return isVisible;
    }

    return false;
  }

  /**
   * Allow pasting only plain text without any HTML markup
   * @param {Event} event
   * @see {@link https://stackoverflow.com/questions/12027137/javascript-trick-for-paste-as-plain-text-in-execcommand}
   */
  pastePlainText(event) {
    // cancel paste
    event.preventDefault();

    // get text representation of clipboard
    const text = (event.originalEvent || event).clipboardData.getData('text/plain');

    // insert text manually
    document.execCommand('insertHTML', false, text);
  }

  /**
   * Add event listener to `paste` event for `*[contenteditable=true]`.
   * Pasting only plain text without any HTML markup.
   * @param {String|HTMLElement} elem - the html elem / elem's id
   * @see {@link https://stackoverflow.com/questions/12027137/javascript-trick-for-paste-as-plain-text-in-execcommand}
   */
  addPastePlainTextEventListener(el) {
    const elem = getElement(el);
    if (elem) {
      elem.addEventListener('paste', this.pastePlainText, true);
    }
  }

  /**
   * Remove event listener to `paste` event for `*[contenteditable=true]`.
   * @param {String|HTMLElement} elem - the html elem / elem's id
   */
  removePastePlainTextEventListener(el) {
    const elem = getElement(el);
    if (elem) {
      elem.removeEventListener('paste', this.pastePlainText, true);
    }
  }

  /**
   * Determine if there is a fullscreen element
   */
  get isInFullScreen() {
    return (document.fullscreenElement && document.fullscreenElement !== null) ||
    (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
    (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
    (document.msFullscreenElement && document.msFullscreenElement !== null);
  }

  /**
   * Display the element as fullscreen view
   * @param {*} elemId - the html elem / elem's id
   */
  enterFullscreen(elemId) {
    const elem = getElement(elemId);
    if (this.isInFullScreen) return;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.webkitEnterFullscreen) {
      /* Safari IOS Mobile */
      elem.webkitEnterFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE/Edge */
      elem.msRequestFullscreen();
    }
  }

  /**
   * Exit the fullscreen view
   */
  exitFullScreen() {
    if (!this.isInFullScreen) return;

    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      /* Firefox */
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      /* IE/Edge */
      document.msExitFullscreen();
    }
  }

  preventDefault = (e) => { e.preventDefault(); }
}

export const elem = new ElementHandler();