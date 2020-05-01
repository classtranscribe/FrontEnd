
function getElement(elem) {
    if (typeof elem === 'string') {
        return document.getElementById(elem);
    } else {
        return elem;
    }
}


/**
 * Scroll the elem into view 
 * @param {String|HTMLElement} elem - the html elem / elem's id
 * @param {Object} options - options for scrolling
 * @param {Boolean} options.center - true if scroll to center
 * @param {Boolean} options.nearest - true if scroll to nearest
 * @param {Boolean} options.smooth - true if scrolling smoothly
 * @param {Boolean} options.focus - true if focus on the elem after scrolling into view
 * @param {Function} options.alternate - function get called if can't find the elem
 */
export function scrollIntoView(elem, options={
	center: false,
	nearest: false,
	smooth: false,
	focus: false,
	alternate: null,
}) {
	const { center, nearest, smooth, focus, alternate } = options;
	
	elem = getElement(elem);
	if (elem) {
		elem.scrollIntoView({
			block: center ? 'center' : nearest ? 'nearest' : 'start',
			behavior: smooth ? 'smooth' : 'auto'
		});

		if (focus && elem.focus) {
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
export function scrollIntoCenter(elem, options={
	smooth: false,
	focus: false,
	alternate: null,
}) {
	scrollIntoView(elem, { center: true, ...options });
}

/**
 * Set the elem's `scrollTop` to zero 
 * @param {String|HTMLElement} elem - the html elem / elem's id
 * @param {Object} options - options for scrolling
 * @param {Number} options.scrollTop - HTMLElement.scrollTop
 * @param {String} options.scrollElemId - scrollTop += scrollElem.offsetTop
 */
export function scrollToTop(elem, options={
	scrollTop: 0,
	scrollElemId: null,
}) {
    let { scrollTop, scrollElemId } = options;

	elem = getElement(elem);
	if (elem) {
        let scrollElem = null;
        if (scrollElemId) scrollElem = document.getElementById(scrollElemId);
        if (scrollElem) {
            scrollTop += scrollElem.offsetTop;
        }
		
		elem.scrollTop = scrollTop;
	}
}

/**
 * Determine if an elem is scrolled into view
 * @param {String|HTMLElement} elem - the html elem / elem's id
 * @param {Number} offsetTop - offset top
 */
export function isScrolledIntoView(elem, offsetTop=200) {
    elem = getElement(elem);
	if (elem && typeof elem.getBoundingClientRect === 'function') {
        var rect = elem.getBoundingClientRect();
        var elemTop = rect.top;
        // var elemBottom = rect.bottom;

        // Only completely visible elements return true:
        var isVisible = elemTop >= 0 && elemTop <= offsetTop;
        // Partially visible elements return true:
        //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
        return isVisible;
    }

    return false;
}