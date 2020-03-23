import React, { useState, useEffect } from 'react'
import { connectWithRedux, epub } from '../../../Utils'
import { ARRAY_INIT } from '../../../../../utils'
import _ from 'lodash'
import './index.scss'
import { PlaceHolder } from 'components'

import EpubList from './EpubList'
import EpubPreview from './EpubPreview'
import CoverPicker from './CoverPicker'
import ActionButtons from './ActionButtons'
import ChapterNavigator from './ChapterNavigator'

const firstTimeEdit = true
var untitledNum = 0

function EpubEditor({
  epubData=ARRAY_INIT
}) {

  const [chapters, setChapters] = useState([])
  const [currChapter, setCurrChapter] = useState({})
  const [coverImgs, setCoverImgs] = useState([])
  const [magnifiedImg, setMagnifiedImg] = useState(null)

  const genChaperFromItems = chapter => {
    return {
      id: chapter.id,
      title: chapter.title || 'New Chapter',
      image: chapter.image || (chapter.items[0] || {}).image,
      items: chapter.items,
      text: _.filter(_.map(chapter.items, item => item.text), txt => txt !== '').join('\n\n')
    }
  }

  // Handle change chapters
  const changeChapter = chapter => {
    setCurrChapter(genChaperFromItems(chapter))
  }

  // Handle split chapters
  const splitChapter = (chapterIndex, itemIndex) => {
    let items = chapters[chapterIndex].items
    chapters[chapterIndex].items = _.slice(items, 0, itemIndex + 1)
    let newChapter = {}
    newChapter.items = _.slice(items, itemIndex + 1, items.length)
    newChapter.id = epub.genId('epub-ch')
    newChapter.title = 'Untitled Chapter' + (untitledNum === 0 ? '' : ' ' + untitledNum)
    untitledNum += 1

    // Check if the cover of the curr chapter is in the splitted new chapter
    let cover = chapters[chapterIndex].image
    if (cover && _.findIndex(newChapter.items, { image: cover }) >= 0) {
      chapters[chapterIndex].image = undefined
    }

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

  // handle edit title
  const handleTitleChange = (chapterIndex, value) => {
    chapters[chapterIndex].title = value
    setChapters([ ...chapters ])
    setCurrChapter(genChaperFromItems(chapters[chapterIndex]))
  }

  // handle choosing cover image
  const pickCoverImage = () => {
    setCoverImgs(_.map(currChapter.items, item => item.image))
  }

  const closeCoverImagePicker = () => {
    setCoverImgs([])
  }

  const saveCoverImage = image => {
    let chapterId = currChapter.id
    let chapterIndex = _.findIndex(chapters, { id: chapterId })
    console.log(image, chapterId, chapterIndex)
    if (chapterIndex >= 0) {
      chapters[chapterIndex].image = image
      currChapter.image = image
      setChapters([ ...chapters ])
      setCurrChapter({ ...currChapter })
    }
    closeCoverImagePicker()
  }

  // handle magnify images
  const magnifyImage = image => setMagnifiedImg(image)
  const endMagnifyImage = () => setMagnifiedImg(null)

  // handle save ePub
  const saveEpub = () => {
    let newEpub = _.map(chapters, chapter => genChaperFromItems(chapter))
    console.log('newEpub', newEpub)
  }

  useEffect(() => {
    if (epubData !== ARRAY_INIT) {
      if (firstTimeEdit) {
        let chapter1 = { items: epubData, title: 'Chapter 1', id: epub.genId('epub-ch') }
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
            <ChapterNavigator
              chapters={chapters}
              currChapter={currChapter}
              changeChapter={changeChapter}
            />

            <EpubList 
              epubData={epubData} 
              chapters={chapters} 
              splitChapter={splitChapter}
              undoSplitChapter={undoSplitChapter}
              changeChapter={changeChapter}
              handleTitleChange={handleTitleChange}
              magnifiedImg={magnifiedImg}
              magnifyImage={magnifyImage}
              endMagnifyImage={endMagnifyImage}
            />

            <EpubPreview 
              currChapter={currChapter} 
              pickCoverImage={pickCoverImage}
            />

            {
              coverImgs.length > 0
              &&
              <CoverPicker 
                images={coverImgs} 
                currChapter={currChapter}
                saveCoverImage={saveCoverImage}
                closeCoverImagePicker={closeCoverImagePicker}
              />
            }

            <ActionButtons
              saveEpub={saveEpub}
            />
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

