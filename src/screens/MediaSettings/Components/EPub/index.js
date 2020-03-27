import React, { useState, useEffect } from 'react'
import { connectWithRedux, epub, NO_EPUB } from '../../Utils'
import { ARRAY_INIT } from 'utils'
import { ENGLISH } from 'screens/Watch/Utils'
import _ from 'lodash'
import './index.scss'
import { PlaceHolder } from 'components'

import RequestEpub from './RequestEpub'
import EpubChapters from './EpubChapters'
import EpubPreview from './Preview'
import CoverPicker from './CoverPicker'
import ActionButtons from './ActionButtons'
import ChapterNavigator from './ChapterNavigator'

const firstTimeEdit = true

export function EpubWithRedux({
  error,
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

  useEffect(() => {
    if (epubData !== ARRAY_INIT) {
      if (firstTimeEdit) {
        let chapters_ = [{ items: epubData, title: 'Default Chapter', id: epub.genId('epub-ch') }]
        // let chapters_ = _.map(epubData, (data, idx) => ({items: [data], title: 'Untitled Chapter ' + idx, id: epub.genId('epub-ch')}))
        epub.setChapters(chapters_)
        if (chapters_[0]) epub.changeChapter(chapters_[0])
      } else {
        setChapters(epubData)
      }
    }
  }, [epubData])

  useEffect(() => {
    // register setState functions
    epub.register({ 
      setChapters, setCurrChapter, setFoldedIds, 
      setLanguage, setCoverImgs, setMagnifiedImg 
    })

    return () => {
      setChapters(ARRAY_INIT)
      epub.epubData([])
    }
  }, [])

  if (error === NO_EPUB) return <RequestEpub mediaId={media.id} />

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
              language={language}
            />

            <EpubChapters 
              epubData={epubData} 
              chapters={chapters} 
              language={language}
              foldedIds={foldedIds}
              magnifiedImg={magnifiedImg}
            />

            <EpubPreview 
              currChapter={currChapter} 
            />

            {
              coverImgs.length > 0
              &&
              <CoverPicker 
                images={coverImgs} 
                currChapter={currChapter}
              />
            }

            <ActionButtons />
          </>
        }
      </div>
    </div>
  )
}

export const EPub = connectWithRedux(
  EpubWithRedux,
  ['error', 'media', 'epubData', 'isEditingEpub'],
  []
)

