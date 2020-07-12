/**
 * The props for CTFragment component
 * @typedef {Object} CTFragmentProps
 * @property {Element} children - Page content
 * @property {Boolean} error - True if error occurs
 * @property {Element} errorElement - The element to display when there is an error
 * @property {Boolean} loading - True if is loading
 * @property {Element} loadingElement - The `CTLayout` supports the dark mode
 * @property {String} id - The unique ID to the element
 * @property {String} className - The Additional classes
 * @property {String} role - The role to the `div` element
 * @property {Object} styles - Additional inline styles
 * @property {Boolean} center - Vertially and horizontally centering its children
 * @property {Boolean} vCenter - Vertially centering its children
 * @property {Boolean} hCenter - Horizontally centering its children
 * @property {Boolean} hEnd - display its children at the end horizontally
 * @property {Boolean} hBetween - justify-content: space-between
 * @property {Boolean} list - The fragment can be a flex list
 * @property {Boolean} fade - The fragment can fade in
 * @property {Boolean} sticky - The fragment can be sticky
 * @property {Boolean} offsetTop -  The `top` css attribute (in `px`) for the fragment element
 * @property {Number|String|Number[]|String[]} padding - The padding in `x 10px`, allows 1,2,3,4,5
 * @property {String} as - A HTML tag name for this fragment, default as `div`
 */

 /**
 * Create the props for CTLayout component
 * @param {CTFragmentProps} creator - the props creator
 * @returns {CTFragmentProps} The props for CTLayout component
 */
export function createCTFragmentProps(creator) {
  return creator;
}