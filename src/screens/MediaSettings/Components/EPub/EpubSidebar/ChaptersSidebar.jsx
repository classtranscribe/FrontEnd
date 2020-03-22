import React, { useState, useEffect } from 'react'
import { PlaceHolder } from '../../../../../components'
import { MSPSidebar } from '../../MSPSidebar'
import { api, util, ARRAY_INIT } from '../../../../../utils'
import { connectWithRedux, epub, NEW_CHAPTER } from '../../../Utils'

function ChaptersSidebar({
  epubData=ARRAY_INIT,
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
    if (epubData !== ARRAY_INIT) {
      setChapters(epubData)
      // in case the currchapter switch after editing
      if (!epubData.find(ch => ch === currChapter)) {
        handleChapterClick(epubData[0] || NEW_CHAPTER)()
      }
    } else {
      handleChapterClick({})()
    }

    return () => setChapters(ARRAY_INIT)
  }, [epubData])
  
  return (
    <>
      <MSPSidebar.Item dark
        icon="restore_page"
        title="MANAGE CHAPTERS"
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
        chapters.length === ARRAY_INIT
        ?
        <PlaceHolder />
        :
        <div className="ct-d-c w-100 ct-a-fade-in">
          {chapters.map(chapter => (
            <MSPSidebar.Item
              key={chapter.id}
              title={chapter.title}
              image={api.getMediaFullPath(chapter.image)}
              current={chapter === currChapter}
              description={util.getFittedName(chapter.text, 50)}
              onClick={onClickChapter(chapter)}
            />
          ))}
        </div>
      }
    </>
  )
}

export default connectWithRedux(
  ChaptersSidebar,
  ['epubData'],
  []
)