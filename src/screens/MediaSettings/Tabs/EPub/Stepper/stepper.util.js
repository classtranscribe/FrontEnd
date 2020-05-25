import {
    EPUB_STEP_SPLIT,
    EPUB_STEP_EDIT,
    EPUB_STEP_DOWNLOAD,
} from 'screens/MediaSettings/controllers/epub/constants';

export function getSteps() {
    return [
        {
            value: EPUB_STEP_SPLIT, 
            name: 'Split Chapters',
            description: 'Set splitting points between screenshots to generate an initial version of ePub chapters. Each chapter can be further subdivided into sub-chapters.'
        },
        {
            value: EPUB_STEP_EDIT, 
            name: 'Edit Chapter',
            description: 'Complete your chapters in Markdown editor, and choose cover images for each section.'
        },
        {
            value: EPUB_STEP_DOWNLOAD,
            name: 'Download ePub',
            description: 'Final Step! Fill out the file information and download your ePub.'
        },
    ];
}

export function getStepIndexMap() {
    return {
        [EPUB_STEP_SPLIT]: 0,
        [EPUB_STEP_EDIT]: 1,
        [EPUB_STEP_DOWNLOAD]: 2
    };
}

export function isStepComplete(step, currStep) {
    let stepIndex = getStepIndexMap();
    return stepIndex[step] < stepIndex[currStep];
}