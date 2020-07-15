export default class EPubConstants {
  // errors
  static ERR_NO_EPUB = 'no-epub';
  
  // steps
  static EPUB_STEP_SPLIT = 'split';
  static EPUB_STEP_EDIT = 'edit';
  static EPUB_STEP_DOWNLOAD = 'download';
  static EPUB_DEFAULT_STEP = EPubConstants.EPUB_STEP_SPLIT;
  static EPUB_STEPS = [
    EPubConstants.EPUB_STEP_SPLIT,
    EPubConstants.EPUB_STEP_EDIT,
    EPubConstants.EPUB_STEP_DOWNLOAD
  ];
  
  // ID prefix
  static CH_ID_PREFIX = 'epub-ch';
  static SCH_ID_PREFIX = 'epub-sub-ch';
  static NAV_CH_ID_PREFIX = 'ee-cn-ch';
  static NAV_SCH_ID_PREFIX = 'ee-cn-sub-ch';
  
  // nav
  static NAV_SHOW = ' show';
  static NAV_HIDE = ' hide';
  static NAV_CLOSE = null;
}