export default class EPubConstants {
  static EPUB_STEP_SPLIT = 'split';
  static EPUB_STEP_EDIT = 'edit';
  static EPUB_STEP_DOWNLOAD = 'download';
  static EPUB_DEFAULT_STEP = EPubConstants.EPUB_STEP_SPLIT;
  
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