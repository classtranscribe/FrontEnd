import React from 'react'
import _ from 'lodash'
import EpubList from './EpubList'
import { Dropdown } from 'semantic-ui-react'
import { Button } from 'pico-ui'
import { langMap } from 'screens/Watch/Utils'
import './index.scss'

const langOptions = _.map(langMap, (text, value) => ({ text, value }))

export default function EpubChapters({
  chapters=[],
  splitChapter,
  undoSplitChapter,
  changeChapter,
  language,
  changeLanguage,
  handleTitleChange,
  magnifyImage,
  endMagnifyImage,
  magnifiedImg,
  foldedIds,
  foldChapter,
  unfoldChapter
}) {

  // console.log('chapters', chapters)

  return (
    <div className="msp-ee-el-con ct-d-c">
      <div className="msp-ee-el-header">
        <div className="w-100 ct-d-r-center-v msp-ee-el-h1">
          <h1>Manage Your ePub Book</h1>
          <Dropdown pointing='right'
            trigger={<Button outlined icon="arrow_drop_down" text={langMap[language]} />}
            icon={null}
            value={language}
            options={langOptions}
            onChange={(e, { value }) => changeLanguage(value)}
          />
        </div>
        <p>
          <span className="msp-ee-el-h-p-t">Instruction</span>
          To manage your ePub chapters, set <span>splitting points</span> between screenshots to generate an initial version of ePub chapters. 
          To change <span>cover images</span>, click the image of the ePub preview on the left.
          <br/>
          After everything is done, hit <span>'Save ePub' button</span> to see the preview of your ePub file. You can also edit the ePub contents there.
        </p>
      </div>

      <div className="ct-d-c ee-el-chapters">
        {chapters.map((chapter, chapterIndex) => (
          <EpubList 
            key={`ee-el-ch-${chapterIndex}`} 
            chapter={chapter}
            chapterIndex={chapterIndex}
            splitChapter={splitChapter}
            undoSplitChapter={undoSplitChapter}
            changeChapter={changeChapter}
            handleTitleChange={handleTitleChange}
            magnifyImage={magnifyImage}
            endMagnifyImage={endMagnifyImage}
            foldedIds={foldedIds}
            foldChapter={foldChapter}
            unfoldChapter={unfoldChapter}
          />
        ))}
      </div>

      {
        magnifiedImg
        &&
        <div className="ee-ep-magnify">
          <img src={magnifiedImg} alt="Magnified screenshot" />
          {/* <Button round icon="close" /> */}
        </div>
      }
    </div>
  )
}
