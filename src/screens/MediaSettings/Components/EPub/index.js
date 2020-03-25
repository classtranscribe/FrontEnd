import React, { useState, useEffect } from 'react'
import { connectWithRedux, epub } from '../../Utils'
import { ARRAY_INIT } from 'utils'
import { ENGLISH } from 'screens/Watch/Utils'
import _ from 'lodash'
import './index.scss'
import { PlaceHolder } from 'components'

import EpubChapters from './EpubChapters'
import EpubPreview from './Preview'
import CoverPicker from './CoverPicker'
import ActionButtons from './ActionButtons'
import ChapterNavigator from './ChapterNavigator'

const firstTimeEdit = true
var untitledNum = 0

export function EpubWithRedux({
  media,
  epubData=ARRAY_INIT,
  // isEditingEpub=false,
}) {

  useEffect(() => {
    if (media.id) {
      epub.setupEpub(media.id)
    }
  }, [media])

  const [language, setLanguage] = useState(ENGLISH)
  const [chapters, setChapters] = useState(ARRAY_INIT)
  const [currChapter, setCurrChapter] = useState({})
  const [coverImgs, setCoverImgs] = useState([])
  const [magnifiedImg, setMagnifiedImg] = useState(null)
  const [foldedIds, setFoldedIds] = useState([])

  ///////////////////////////////////////////////////////////////////////////
  // Generate a chapter based on list of screenshots and transcriptions
  ///////////////////////////////////////////////////////////////////////////
  const genChaperFromItems = chapter => {
    return {
      id: chapter.id,
      title: chapter.title || 'Untitled Chapter',
      image: chapter.image || (chapter.items[0] || {}).image,
      items: chapter.items,
      text: _.filter(_.map(chapter.items, item => item.text), txt => txt !== '').join('\n\n')
    }
  }

  ///////////////////////////////////////////////////////////////////////////
  // Handle change chapters
  ///////////////////////////////////////////////////////////////////////////
  const changeChapter = chapter => {
    setCurrChapter(genChaperFromItems(chapter))
  }

  ///////////////////////////////////////////////////////////////////////////
  // Handle split chapters
  ///////////////////////////////////////////////////////////////////////////
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

  ///////////////////////////////////////////////////////////////////////////
  // handle edit title
  ///////////////////////////////////////////////////////////////////////////
  const handleTitleChange = (chapterIndex, value) => {
    chapters[chapterIndex].title = value
    setChapters([ ...chapters ])
    setCurrChapter(genChaperFromItems(chapters[chapterIndex]))
  }

  ///////////////////////////////////////////////////////////////////////////
  // handle choosing cover image
  ///////////////////////////////////////////////////////////////////////////
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

  ///////////////////////////////////////////////////////////////////////////
  // handle fold/unfold a chapter
  ///////////////////////////////////////////////////////////////////////////
  const foldChapter = id => {
    setFoldedIds([ ...foldedIds, id ])
  }

  const unfoldChapter = id => {
    _.remove(foldedIds, fid => fid === id)
    setFoldedIds([ ...foldedIds ])
  }

  ///////////////////////////////////////////////////////////////////////////
  // handle language change
  ///////////////////////////////////////////////////////////////////////////
  const changeLanguage = lang => {
    setLanguage(lang)
    setChapters(ARRAY_INIT)
    epub.changeEpubLanguage(lang)
  }

  ///////////////////////////////////////////////////////////////////////////
  // handle magnify images
  ///////////////////////////////////////////////////////////////////////////
  const magnifyImage = image => setMagnifiedImg(image)
  const endMagnifyImage = () => setMagnifiedImg(null)

  ///////////////////////////////////////////////////////////////////////////
  // handle save ePub
  ///////////////////////////////////////////////////////////////////////////
  const saveEpub = () => {
    let newEpub = _.map(chapters, chapter => genChaperFromItems(chapter))
    console.log('newEpub', newEpub)
    epub.isEditingEpub(false)
  }

  const cancelEditing = () => {
    epub.isEditingEpub(false)
  }

  useEffect(() => {
    if (epubData !== ARRAY_INIT) {
      if (firstTimeEdit) {
        // let chapters_ = [{ items: epubData, title: 'Default Chapter', id: epub.genId('epub-ch') }]
        let chapters_ = _.map(epubData, (data, idx) => ({items: [data], title: 'Untitled Chapter ' + idx, id: epub.genId('epub-ch')}))
        setChapters(chapters_)
        setCurrChapter(genChaperFromItems(chapters_[0]))
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
          chapters === ARRAY_INIT
          ?
          <div className="w-100">
            <PlaceHolder />
          </div>
          :
          <>
            <ChapterNavigator
              chapters={chapters}
              currChapter={currChapter}
              changeChapter={changeChapter}
              language={language}
              changeLanguage={changeLanguage}
            />

            <EpubChapters 
              epubData={epubData} 
              chapters={chapters} 
              splitChapter={splitChapter}
              undoSplitChapter={undoSplitChapter}
              changeChapter={changeChapter}
              language={language}
              changeLanguage={changeLanguage}
              handleTitleChange={handleTitleChange}
              magnifiedImg={magnifiedImg}
              magnifyImage={magnifyImage}
              endMagnifyImage={endMagnifyImage}
              foldedIds={foldedIds}
              foldChapter={foldChapter}
              unfoldChapter={unfoldChapter}
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
              cancelEditing={cancelEditing}
            />
          </>
        }
      </div>
    </div>
  )
}

export const EPub = connectWithRedux(
  EpubWithRedux,
  ['media', 'epubData', 'isEditingEpub'],
  []
)

