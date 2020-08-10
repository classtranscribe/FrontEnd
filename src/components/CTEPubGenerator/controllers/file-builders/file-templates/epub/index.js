import raw from 'raw.macro';
import { ROOT_CSS } from '../styles';

export const OEBPS_STYLE_CSS = ROOT_CSS + raw('./epub.css');

export { default as MIMETYPE } from './mimetype.js';
export { default as META_INF_CONTAINER_XML } from './container.xml.js';
export { default as OEBPS_TOC_NCX } from './toc.ncx.js';
export { default as OEBPS_TOC_XHTML } from './toc.xhtml.js';
export { default as OEBPS_CONTENT_OPF } from './content.opf.js'
export { default as OEBPS_CONTENT_XHTML } from './content.xhtml.js';
