/** Tabs */
export const TAB_EDIT_TRANS = 'trans';
export const TAB_EPUB       = 'epub';
export const TAB_DEFAULT    = TAB_EDIT_TRANS;
export const mspTabs = [
  { id: 'msp-tab-' + TAB_EDIT_TRANS, name: 'Transcriptions',  hash: TAB_EDIT_TRANS },
  { id: 'msp-tab-' + TAB_EPUB      , name: 'ePub',           hash: TAB_EPUB },
];

/** Epub */
export const DEFAULT_IS_EDITING_EPUB = true;
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

export const textEditorMap = {
  [EDITOR_RICHTEXT]: 'Rich Text Editor',
  [EDITOR_HTML]: 'HTML Editor',
  [EDITOR_MARKDOWN]: 'Markdown Editor'
};

export const EDITOR_TYPE_SPLITTER = '<!-- EDITOR_TYPE_SPLITTER -->';