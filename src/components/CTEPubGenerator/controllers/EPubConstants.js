import EPubIDs from './EPubIDs';

export default class EPubConstants extends EPubIDs {
  // errors
  static NoEPubDataRequestedError = 'no-epub';
  
  // steps
  static EPubStepSplitChapters = 'split';
  static EPubStepEditChapters = 'edit';
  static EPubStepDownload = 'download';
  static EPubStepDefaultFirstStep = EPubConstants.EPubStepSplitChapters;
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