/**
 *
 * @param {String|HTMLElement} elem - the html elem / elem's id
 * @returns {HTMLElement}
 */
function getElement(elem) {
  if (typeof elem === 'string') {
    return document.getElementById(elem);
  }
  return elem;
}

/**
 * Focus on the elem
 * @param {String} elemId the id of the html elem
 */
export function focus(elemId) {
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
 * @param {Function} options.alternate function get called if can't find the elem
 */
export function scrollIntoView(
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
 * @param {Function} options.alternate - function get called if can't find the elem
 */
export function scrollIntoCenter(
  elem,
  options = {
    smooth: false,
    focus: false,
    alternate: null,
  },
) {
  scrollIntoView(elem, { center: true, ...options });
}

/**
 * Set the elem's `scrollTop` to zero
 * @param {String|HTMLElement} elem - the html elem / elem's id
 * @param {Object} options - options for scrolling
 * @param {Number} options.scrollTop - HTMLElement.scrollTop
 * @param {String} options.scrollElemId - scrollTop += scrollElem.offsetTop
 */
export function scrollToTop(
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
export function isScrolledIntoView(el, offsetTop = 200) {
  const elem = getElement(el);
  if (elem && typeof elem.getBoundingClientRect === 'function') {
    const rect = elem.getBoundingClientRect();
    const elemTop = rect.top;
    // var elemBottom = rect.bottom;

    // Only completely visible elements return true:
    const isVisible = elemTop >= 0 && elemTop <= offsetTop;
    // Partially visible elements return true:
    // isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    return isVisible;
  }

  return false;
}

/**
 * Allow pasting only plain text without any HTML markup
 * @param {Event} event
 * @see {@link https://stackoverflow.com/questions/12027137/javascript-trick-for-paste-as-plain-text-in-execcommand}
 */
function pastePlainText(event) {
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
export function addPastePlainTextEventListener(el) {
  const elem = getElement(el);
  if (elem) {
    elem.addEventListener('paste', pastePlainText, true);
  }
}

/**
 * Remove event listener to `paste` event for `*[contenteditable=true]`.
 * @param {String|HTMLElement} elem - the html elem / elem's id
 */
export function removePastePlainTextEventListener(el) {
  const elem = getElement(el);
  if (elem) {
    elem.removeEventListener('paste', pastePlainText, true);
  }
}
