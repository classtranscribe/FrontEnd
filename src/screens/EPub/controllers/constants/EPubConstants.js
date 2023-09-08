/**
 * The contants used for generating ePub files
 */
export default class EPubConstants {
  // errors
  static EPubDataNotRequestedError = 'epub-not-requested';
  static EPubDataRequestedError = 'epub-requested';
  
  // view options
  static EpbReadOnly = 'v-read-only';
  static EpbEditStructure = 'v-structure';
  static EpbEditChapter = 'v-edit';
  static EditINote = 'v-edit-inote'

  static EpbDefaultView = EPubConstants.EditINote;
  static EPubViews = [
    EPubConstants.EpbReadOnly,
    EPubConstants.EpbEditStructure,
    EPubConstants.EpbEditChapter,
    EPubConstants.EditINote
  ];

  // saving status
  static EpbUnsaved = 0;
  static EpbSaving = 1;
  static EpbSaved = 2;
  static EpbSaveFailed = 3;
  
  // nav
  static EPubNavShowing = 'show';
  static EPubNavHiding = 'hide';
  static EPubNavClosed = null;

  // in window.location.hash 
  // from =
  static HFromNew = 'new'
}