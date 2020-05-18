import React from 'react';
import { Button } from 'pico-ui';
import { LanguageMenuTrigger } from '../../LanguageMenuTrigger';
import { epub, connectWithRedux } from 'screens/MediaSettings/Utils/epub';

import EpubStepper from '../../Stepper';

function InstructionHeading({
  epubData,
  chapters=[],
  language,
}) {

  let showResetBtn = chapters.length > 1 || chapters[0].subChapters.length > 0;
  let showSplitAllBtn = chapters.length !== epubData.length;
  let showSubdivideAllBtn = true;//chapters.reduce((acc, ch) => acc + ch.items.length, 0) !== 0;

  return (
    <div className="msp-ee-sch-instr-h">
      <div className="w-100 ct-d-r-center-v msp-ee-sch-h1">
        <h1>Manage Your ePub Book</h1>
        <LanguageMenuTrigger
          language={language}
        />
      </div>

      <EpubStepper />

      <div className="w-100 ee-sch-h-block">
        <h4>Instruction</h4>
        <p>
          To manage your ePub chapters, set <b>splitting points</b> between screenshots to 
          generate an initial version of ePub chapters. 
          Each chapter can be further <b>subdivided</b> into sub-chapters.
        </p>
        <p>
          After building the structure of your ePub, hit <b>'Save and Preview' button</b> to 
          see the preview of your ePub file, and modify the ePub contents there.
        </p>

        <h4>Actions</h4>
        <ul>
          <li>
            <b>Split</b> - Split screenshots and transcripts into chapters.
          </li>
          <li>
            <b>Subdivide</b> - Divide a chapter into several sub-chapters.
          </li>
        </ul>
      </div>

      <h4 className="w-100 pl-2">
        QUICK ACTIONS
      </h4>

      <div className="w-100">
        <Button.Group>
          {
            showResetBtn
            &&
            <Button outlined onClick={() => epub.resetToDefaultChapters()}>
              Reset to Default Chapters
            </Button>
          }
          {
            showSplitAllBtn
            &&
            <Button outlined onClick={() => epub.splitChaptersByScreenshots()}>
              Split Chapters by Screenshots
            </Button>
          }
          {
            showSubdivideAllBtn
            &&
            <Button outlined onClick={() => epub.subdivideChaptersByScreenshots()}>
              Subdivide Chapters by Screenshots
            </Button>
          }
        </Button.Group>
      </div>
    </div>
  );
}

export default connectWithRedux(
  InstructionHeading,
  [
    'epubData',
    'chapters',
    'language'
  ]
);
