import React, { useState, useEffect } from 'react'
import { connectWithRedux } from '_redux/media-settings'
import { PlaceHolder } from '../../../../Instructor/Components/Placeholder'
import { MSPSidebar } from '../../MSPSidebar'
import { api, util } from 'utils'
import { epub } from '../../../Utils'

function ChaptersSidebar({
  epubData=[],
  currChapter,
  handleChapterClick,
}) {

  const [chapters, setChapters] = useState([])

  const resetChapters = () => {
    epub.resetEpub()
  }

  useEffect(() => {
    if (epubData.length > 0) {
      setChapters(epubData)
      handleChapterClick(epubData[0])()
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
              title={chapter.title}
              image={api.getMediaFullPath(chapter.image)}
              current={chapter === currChapter}
              description={util.getFittedName(chapter.text, 50)}
              onClick={handleChapterClick(chapter)}
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