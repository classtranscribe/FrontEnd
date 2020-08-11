import raw from 'raw.macro';
import { ROOT_CSS } from '../styles';

export const PRISM_JS = raw('./prism.js.txt');
export const STYLE_CSS = raw('./style.css') + ROOT_CSS;
export { default as INDEX_HTML_LIVE } from './index.live.html.js';
export { default as INDEX_HTML_LOCAL } from './index.local.html.js';
