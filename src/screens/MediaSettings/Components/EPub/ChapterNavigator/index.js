import React, { useState, useEffect } from 'react'
import { Button } from 'pico-ui'
import './index.scss'

export default function ChapterNavigator({
  chapters,
  currChapter,
  changeChapter,
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
      hideNavihator()
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

  return show ? (
    <div className="msp-ee-cn-con">
      <div className="ee-cn-wrapper" onClick={hideNavihator}></div>
      <div className={"ee-cn-ch-con" + show}>
        <div className="ct-d-r-center-v ee-cn-h">
          <h3>Chapters</h3>
          <Button round
            icon="close"
            color="transparent"
            onClick={hideNavihator} 
          />
        </div>
        <div className="ee-cn-ch-ul ct-d-c">
          {chapters.map( chapter => (
            <Button round
              key={`ee-cn-ch-${chapter.id}`}
              id={`ee-cn-ch-${chapter.id}`}
              classNames="ee-cn-ch-li"
              color={currChapter.id === chapter.id ? "teal" : 'transparent'}
              onClick={navigate(chapter)}
            >
              {chapter.title}
            </Button>
          ))}
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
