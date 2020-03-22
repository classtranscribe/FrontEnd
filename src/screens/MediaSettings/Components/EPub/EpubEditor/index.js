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
            <EpubList epubData={epubData} chapters={chapters} />
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

