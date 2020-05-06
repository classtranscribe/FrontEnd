export const DEFAULT_IS_MANAGING_CHAPTERS = false;

export const EPUB_STEP_SPLIT = 'split';
export const EPUB_STEP_EDIT = 'edit';
export const EPUB_STEP_DOWNLOAD = 'download';
export const EPUB_DEFAULT_STEP = EPUB_STEP_SPLIT;

// ID prefix
export const CHAPTER_ID_PREFIX = 'epub-ch';
export const SUB_CHAPTER_ID_PREFIX = 'epub-sub-ch';
export const NAV_CH_ID_PREFIX = 'ee-cn-ch';
export const NAV_SUB_CH_ID_PREFIX = 'ee-cn-sub-ch';

// nav
export const NAV_SHOW = ' show';
export const NAV_HIDE = ' hide';
export const NAV_CLOSE = null;

// epub chapters
export const NEW_CHAPTER = { id: 'msp-new-chapter' };

// Errors
export const NO_EPUB = 'no-epub';

// Editor Type
export const EDITOR_NONE = 'none';
export const EDITOR_DISPLAY = 'display';
export const EDITOR_RICHTEXT = 'richtext';
export const EDITOR_HTML = 'html';
export const EDITOR_MARKDOWN = 'markdown';

// Editor Theme
export const EDITOR_THEME_MONOKAI = 'monokai';
export const EDITOR_THEME_XCODE = 'xcode';

export const textEditorMap = {
  [EDITOR_RICHTEXT]: 'Rich Text Editor',
  [EDITOR_HTML]: 'HTML Editor',
  [EDITOR_MARKDOWN]: 'Markdown Editor'
};

export const EDITOR_TYPE_SPLITTER = '<!-- EDITOR_TYPE_SPLITTER -->';

export const EPUB_HEADING_1 = 'Chapter Heading';
export const EPUB_HEADING_2 = 'Sub-Chapter Heading';
export const EPUB_HEADING_3 = 'Section Heading';

export const epubHeadings = [
  EPUB_HEADING_1,
  EPUB_HEADING_2,
  EPUB_HEADING_3
];