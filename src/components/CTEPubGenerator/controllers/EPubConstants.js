import EPubIDs from './EPubIDs';

export default class EPubConstants extends EPubIDs {
  // errors
  static EPubDataNotRequestedError = 'epub-not-requested';
  static EPubDataRequestedError = 'epub-requested';
  
  // steps
  static EPubStepLaunchScreen = 'launch';
  static EPubStepSplitChapters = 'split';
  static EPubStepEditChapters = 'edit';
  static EPubStepDownload = 'download';
  static EPubStepDefaultFirstStep = EPubConstants.EPubStepLaunchScreen;
  // static EPubStepDefaultFirstStep = EPubConstants.EPubStepSplitChapters;
  static EPubSteps = [
    EPubConstants.EPubStepSplitChapters,
    EPubConstants.EPubStepEditChapters,
    EPubConstants.EPubStepDownload
  ];
  
  // nav
  static EPubNavShowing = 'show';
  static EPubNavHiding = 'hide';
  static EPubNavClosed = null;
}