import React, { useState, useEffect } from 'react'
import { PlaceHolder } from '../../../../../components'
import { MSPSidebar } from '../../MSPSidebar'
import { api, util } from '../../../../../utils'
import { connectWithRedux, epub } from '../../../Utils'

function ChaptersSidebar({
  epubData=[],
  currChapter,
  handleChapterClick,
}) {

  const [chapters, setChapters] = useState([])

  const resetChapters = () => {
    epub.resetEpub()
  }

  const onClickChapter = chapter => () => {
    handleChapterClick({})()
    setTimeout(() => {
      handleChapterClick(chapter)()
    }, 300);
  }

  useEffect(() => {
    if (epubData.length > 0) {
      setChapters(epubData)
      // in case the currchapter switch after editing
      if (!epubData.find(ch => ch === currChapter)) {
        handleChapterClick(epubData[0])()
      }
    } else {
      handleChapterClick({})()
    }
  }, [epubData])
  
  return (
    <>
      <MSPSidebar.Item dark
        icon="restore_page"
        title="RESET CHAPTERS"
        onClick={resetChapters}
      />
      <div className="pl-3 pr-3 pb-2 mb-2 ct-border-b">
        You can re-match the images and texts of chapters.
      </div>

      <div className="ip-sb-title ct-d-r-center-v">
        <i className="material-icons" aria-hidden="true">collections_bookmark</i>
        <h2>Chapters</h2>
      </div>

      {
        chapters.length > 0
        ?
        <div className="ct-d-c w-100 ct-a-fade-in">
          {chapters.map(chapter => (
            <MSPSidebar.Item
              key={chapter.id}
              title={chapter.title}
              image={api.getMediaFullPath(chapter.image)}
              current={chapter === currChapter}
              description={util.getFittedName(epub.formatText(chapter.text), 50)}
              onClick={onClickChapter(chapter)}
            />
          ))}
        </div>
        :
        <PlaceHolder />
      }
    </>
  )
}

export default connectWithRedux(
  ChaptersSidebar,
  ['epubData'],
  []
)