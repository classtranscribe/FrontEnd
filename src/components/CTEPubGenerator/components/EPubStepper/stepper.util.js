import { CTEPubConstants as Constants } from '../../controllers';

export function getSteps() {
  return [
    {
      value: Constants.EPubStepSplitChapters, 
      name: 'Split Chapters',
      description: 'Set splitting points between screenshots to generate an initial version of ePub chapters. Each chapter can be further subdivided into sub-chapters.'
    },
    {
      value: Constants.EPubStepEditChapters, 
      name: 'Edit Chapter',
      description: 'Complete your chapters in Markdown editor, and choose cover images for each section.'
    },
    {
      value: Constants.EPubStepDownload,
      name: 'Download ePub',
      description: 'Final Step! Fill out the file information and download your ePub.'
    },
  ];
}

export function getStepIndexMap() {
  return {
    [Constants.EPubStepSplitChapters]: 0,
    [Constants.EPubStepEditChapters]: 1,
    [Constants.EPubStepDownload]: 2
  };
}

export function isStepComplete(step, currStep) {
  let stepIndex = getStepIndexMap();
  return stepIndex[step] < stepIndex[currStep];
}