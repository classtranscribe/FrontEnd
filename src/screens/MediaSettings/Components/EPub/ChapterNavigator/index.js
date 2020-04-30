import React, { useState, useEffect } from 'react'
import { connectWithRedux, epub } from '../../../Utils'
import { Button } from 'pico-ui'
import './index.scss'
import { util } from 'utils'

function ChapterNavigatorWithRedux({
  chapters,
  currChapter,
  isEditingEpub=false,
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
    util.elem.scrollIntoView(chapter.id);
    epub.changeChapter(chapter);
    if (isEditingEpub) hideNavihator();
  }

  useEffect(() => {
    if (show === ' true') {
      util.elem.scrollIntoCenter('ee-cn-ch-' + currChapter.id);
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
            {chapters.map( (chapter, chapterIndex) => (
              <div key={`ee-cn-ch-${chapter.id}`} className="ee-cn-ch-li">
                <Button round
                  id={`ee-cn-ch-${chapter.id}`}
                  classNames="ee-cn-ch-li-ch"
                  color={currChapter.id === chapter.id ? "teal" : 'transparent'}
                  onClick={navigate(chapter)}
                >
                  {isEditingEpub ? '' : `${chapterIndex+1}. `} {chapter.title}
                </Button>
                {
                  isEditingEpub
                  &&
                  chapter.subChapters.map(subChapter => (
                    <Button round
                      id={`ee-cn-sub-ch-${subChapter.id}`}
                      classNames="ee-cn-ch-li-sub-ch"
                      color={currChapter.id === subChapter.id ? "teal" : 'transparent'}
                      onClick={navigate(subChapter)}
                    >
                      {subChapter.title}
                    </Button>
                  ))
                }
              </div>
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
