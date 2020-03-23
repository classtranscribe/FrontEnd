import React, { useState, useEffect } from 'react'
import { connectWithRedux, epub } from '../../../Utils'
import { ARRAY_INIT } from '../../../../../utils'
import _ from 'lodash'
import './index.scss'
import { PlaceHolder } from 'components'
import EpubList from './EpubList'
import EpubPreview from './EpubPreview'

const firstTimeEdit = true

function EpubEditor({
  epubData=ARRAY_INIT
}) {

  const [chapters, setChapters] = useState([])
  const [currChapter, setCurrChapter] = useState({})

  const genChaperFromItems = chapter => {
    return {
      id: epub.genId(`epub-chapter-`),
      title: chapter.title || 'New Chapter',
      image: (chapter.items[0] || {}).image,
      text: _.filter(_.map(chapter.items, item => item.text), txt => txt !== '').join('\n\n')
    }
  }

  const changeChapter = chapter => {
    setCurrChapter(genChaperFromItems(chapter))
  }

  const splitChapter = (chapterIndex, itemIndex) => {
    let items = chapters[chapterIndex].items
    chapters[chapterIndex].items = _.slice(items, 0, itemIndex + 1)
    let numOfUntitled = _.filter(chapters, chapter => chapter.title.startsWith('Untitled Chapter')).length
    let newChapter = { title: 'Untitled Chapter' + (numOfUntitled === 0 ? '' : (' ' + numOfUntitled)) }
    newChapter.items = _.slice(items, itemIndex + 1, items.length)
    setChapters([
      ..._.slice(chapters, 0, chapterIndex+1),
      newChapter,
      ..._.slice(chapters, chapterIndex+1, chapters.length),
    ])
    setCurrChapter(genChaperFromItems(newChapter))
  }

  const undoSplitChapter = chapterIndex => {
    let currItems = chapters[chapterIndex].items
    let prevItems = chapters[chapterIndex - 1].items
    chapters[chapterIndex - 1].items = [ ...prevItems, ...currItems ]
    setChapters([
      ..._.slice(chapters, 0, chapterIndex),
      ..._.slice(chapters, chapterIndex+1, chapters.length),
    ])
    setCurrChapter(genChaperFromItems(chapters[chapterIndex - 1]))
  }

  const handleTitleChange = (chapterIndex, value) => {
    chapters[chapterIndex].title = value
    setChapters([ ...chapters ])
    setCurrChapter(genChaperFromItems(chapters[chapterIndex]))
  }

  useEffect(() => {
    if (epubData !== ARRAY_INIT) {
      if (firstTimeEdit) {
        let chapter1 = { items: epubData, title: 'Chapter 1' }
        setChapters([ chapter1 ])
        setCurrChapter(genChaperFromItems(chapter1))
      } else {
        setChapters(epubData)
      }
    }
    return () => setChapters(ARRAY_INIT)
  }, [epubData])


  return (
    <div className="msp-ee-con ct-a-fade-in">
      <div className="msp-ee" data-scroll>
        {
          epubData === ARRAY_INIT
          ?
          <PlaceHolder />
          :
          <>
            <EpubList 
              epubData={epubData} 
              chapters={chapters} 
              splitChapter={splitChapter}
              undoSplitChapter={undoSplitChapter}
              changeChapter={changeChapter}
              handleTitleChange={handleTitleChange}
            />
            <EpubPreview currChapter={currChapter} />
          </>
        }
      </div>
    </div>
  )
}

export default connectWithRedux(
  EpubEditor,
  ['epubData'],
  []
)

