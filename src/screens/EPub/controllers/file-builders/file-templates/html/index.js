import { ROOT_CSS } from '../styles';
import PRISM_JS from './prism.js.txt?raw';
import STYLE_CSS_RAW from './style.css?raw';

export { PRISM_JS };
export const STYLE_CSS = STYLE_CSS_RAW + ROOT_CSS;
export { default as INDEX_HTML_LIVE } from './index.live.html.js';
export { default as INDEX_HTML_LOCAL } from './index.local.html.js';
