import React from 'react'
import { Button } from 'pico-ui'
import { LanguageMenuTrigger } from '../LanguageMenuTrigger'
import { epub } from 'screens/MediaSettings/Utils'

export default function EpubHeader({
  epubData,
  chapters=[],
  language,
}) {

  let showResetBtn = chapters.length > 1 || chapters[0].subChapters.length > 0;
  let showSplitAllBtn = chapters.length !== epubData.length;
  let showSubdivideAllBtn = true;//chapters.reduce((acc, ch) => acc + ch.items.length, 0) !== 0;

  return (
    <div className="msp-ee-el-header">
      <div className="w-100 ct-d-r-center-v msp-ee-el-h1">
        <h1>Manage Your ePub Book</h1>
        <LanguageMenuTrigger
          language={language}
        />
      </div>

      <p>
        <span className="msp-ee-el-h-p-t">Instruction</span>
        To manage your ePub chapters, set <span>splitting points</span> between screenshots to generate an initial version of ePub chapters. 
        To change <span>cover images</span>, click the image of the ePub preview on the left.
        <br/>
        After everything is done, hit <span>'Save ePub' button</span> to see the preview of your ePub file. You can also edit the ePub contents there.
      </p>

      <h4 className="w-100 d-flex justify-content-end pr-2">
        QUICK ACTIONS
      </h4>

      <div className="w-100 d-flex justify-content-end">
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
              Split by Screenshots
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
