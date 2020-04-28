
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
export function scrollIntoView(elemId, options={
	center: false,
	nearest: false,
	smooth: false,
	focus: false,
	alternate: null,
}) {
	const { center, nearest, smooth, focus, alternate } = options
	
	let elem = document.getElementById(elemId)
	if (elem) {
		elem.scrollIntoView({
			block: center ? 'center' : nearest ? 'nearest' : 'start',
			behavior: smooth ? 'smooth' : 'auto'
		})

		if (focus && elem.focus) {
			elem.focus()
		}
	} else if (typeof alternate === 'function') {
		alternate()
	}
}

/**
 * Scroll the elem into center based on its `id`
 * @param {String} elemId the id of the html elem
 * @param {Object} options options for scrolling
 * @param {Boolean} options.smooth true if scrolling smoothly
 * @param {Boolean} options.focus true if focus on the elem after scrolling into view
 * @param {Function} options.alternate function get called if can't find the elem
 */
export function scrollIntoCenter(elemId, options={
	smooth: false,
	focus: false,
	alternate: null,
}) {
	scrollIntoView(elemId, { center: true, ...options })
}

/**
 * Set the elem's `scrollTop` to zero based on its `id`
 * @param {String} elemId the id of the html elem
 */
export function scrollToTop(elemId) {
	let elem = document.getElementById(elemId)
	if (elem) {
		elem.scrollTop = 0
	}
}