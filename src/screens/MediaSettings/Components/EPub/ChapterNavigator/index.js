import React, { useState, useEffect } from 'react'
import { connectWithRedux } from '../../../Utils'
import { Button } from 'pico-ui'
import './index.scss'
import EpubHeader from '../EpubHeader'

function ChapterNavigatorWithRedux({
  chapters,
  currChapter,
  changeChapter,
  isEditingEpub=false,
  language,
  changeLanguage,
}) {

  const [show, setShow] = useState(null)

  const showNavigator = () => setShow(' true')
  const hideNavihator = () => {
    setShow(' hide')
    setTimeout(() => {
      setShow(null)
    }, 100)
  }

  const navigate = chapter => () => {
    let chElem = document.getElementById(chapter.id)
    if (chElem) {
      chElem.scrollIntoView()
      changeChapter(chapter)
      if (isEditingEpub) hideNavihator()
    }
  }

  useEffect(() => {
    if (show === ' true') {
      let chTitleElem = document.getElementById('ee-cn-ch-' + currChapter.id)
      if (chTitleElem) {
        chTitleElem.scrollIntoView({ block: 'center' })
      }
    }
  }, [show])

  useEffect(() => {
    if (isEditingEpub && show) {
      setShow(null)
    } else if (!isEditingEpub && !show) {
      setShow(' true')
    }
  }, [isEditingEpub])


  return show ? (
    <div className="msp-ee-cn-con" data-editing={isEditingEpub}>
      <div className="ee-cn-wrapper" onClick={hideNavihator}></div>
      <div className={"ee-cn-ch-con" + show}>
        <div className="ee-cn-ch-scroll-con" data-scroll>
          {
            !isEditingEpub
            &&
            <EpubHeader padded={false} title="Preview" language={language} changeLanguage={changeLanguage}>

            </EpubHeader>
          }
          <div className="ct-d-r-center-v ee-cn-h">
            <h3>Chapters</h3>
            {
              isEditingEpub
              &&
              <Button round
                icon="close"
                color="transparent"
                onClick={hideNavihator} 
              />
            }
          </div>
          <div className="ee-cn-ch-ul ct-d-c">
            {chapters.map( (chapter, index) => (
              <Button round
                key={`ee-cn-ch-${chapter.id}`}
                id={`ee-cn-ch-${chapter.id}`}
                classNames="ee-cn-ch-li"
                color={currChapter.id === chapter.id ? "teal" : 'transparent'}
                onClick={navigate(chapter)}
              >
                {isEditingEpub ? '' : `${index+1}. `} {chapter.title}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>

  ) : (

    <div className="msp-ee-cn-con">
      <Button round
        classNames="ee-cn-open-btn"
        icon="list"
        color="teal"
        onClick={showNavigator}
      />
    </div>
  )
}

export default connectWithRedux(
  ChapterNavigatorWithRedux,
  ['isEditingEpub'],
  []
)
