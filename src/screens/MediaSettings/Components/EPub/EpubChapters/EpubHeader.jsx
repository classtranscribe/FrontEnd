import React from 'react'
import { Button } from 'pico-ui'
import { LanguageMenuTrigger } from '../LanguageMenuTrigger'
import { epub } from 'screens/MediaSettings/Utils'

export default function EpubHeader({
  language,
}) {
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

      <div className="w-100 d-flex justify-content-end">
        <Button.Group>
          <Button outlined onClick={() => epub.resetToDefaultChapters()}>
            Reset to Default Chapters
          </Button>
          <Button outlined onClick={() => epub.splitChaptersByScreenshots()}>
            Split by Screenshots
          </Button>
        </Button.Group>
      </div>
    </div>
  )
}
