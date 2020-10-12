import React from 'react';
import { Button } from 'pico-ui';
import { CTFragment } from 'layout';
import { epub } from '../../controllers';
import { connectWithRedux } from '../../redux';
import { EPubStepper } from '../../components';

function InstructionHeading({
  rawEPubData,
  chapters=[],
  // language,
}) {
  let showResetBtn = chapters.length > 1 || chapters[0].subChapters.length > 0;
  let showSplitAllBtn = chapters.length !== rawEPubData.length;
  let showSubdivideAllBtn = true;

  return (
    <CTFragment className="ct-epb inst-heading">
      <EPubStepper />

      <CTFragment className="inst-h-quote">
        <h4>Instruction</h4>
        <p>
          To manage your ePub chapters, set <b>splitting points</b> between screenshots to 
          generate an initial layout of your ePub chapters. 
          Each chapter can be further <b>subdivided</b> into sub-chapters.
        </p>
        <p>
          After building the structure of your ePub, 
          proceed to the <b>Chapter Editor</b> to modify the 
          texts and images there.
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
      </CTFragment>

      <h4 className="w-100 pl-2">
        QUICK ACTIONS
      </h4>

      <div className="w-100">
        <Button.Group>
          {
            showResetBtn
            &&
            <Button outlined onClick={epub.data.resetToDefaultChapters}>
              Reset to Default Chapters
            </Button>
          }
          {
            showSplitAllBtn
            &&
            <Button outlined onClick={epub.data.splitChaptersByScreenshots}>
              Split Chapters by Screenshots
            </Button>
          }
          {
            showSubdivideAllBtn
            &&
            <Button outlined onClick={epub.data.subdivideChaptersByScreenshots}>
              Subdivide Chapters by Screenshots
            </Button>
          }
        </Button.Group>
      </div>
    </CTFragment>
  );
}

export default connectWithRedux(
  InstructionHeading,
  [
    'rawEPubData',
    'chapters',
    'language'
  ]
);
