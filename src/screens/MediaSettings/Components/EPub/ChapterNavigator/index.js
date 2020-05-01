import React, { useState, useEffect } from 'react';
import { connectWithRedux, epub } from '../../../Utils';
import { Button } from 'pico-ui';
import './index.scss';

function ChapterNavigatorWithRedux({
  chapters,
  currChapter,
  isEditingEpub=false,
}) {

  const [show, setShow] = useState(epub.NAV_CLOSE);
  const [navId, setNavId] = useState('');
  const currChapterId = navId || currChapter.id;

  useEffect(() => {
    epub.onShowNavChange(currChapterId);
  }, [show]);

  useEffect(() => {
    if (isEditingEpub && show) {
      setShow(epub.NAV_CLOSE);
    } else if (!isEditingEpub && !show) {
      setShow(epub.NAV_SHOW);
    }

    setNavId(currChapter.id);
  }, [isEditingEpub]);

  useEffect(() => {
    // register setState funcs to epub state
    epub.state.registerSetStateFunc({
      setNavId,
      setShowNav: setShow
    });

    // add event listener to preview panel's scrolling
    epub.addScrollEventListenerToEpubPreview();

    return () => {
      epub.removeScrollEventListenerToEpubPreview();
    }
  }, []);


  return show ? (
    <div className="msp-ee-cn-con" data-editing={isEditingEpub}>
      <div className="ee-cn-wrapper" onClick={epub.hideNavihator}></div>
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
                onClick={epub.hideNavihator} 
              />
            }
          </div>
          <div className="ee-cn-ch-ul ct-d-c">
            {chapters.map( (chapter, chapterIndex) => (
              <div key={`ee-cn-ch-${chapter.id}`} className="ee-cn-ch-li">
                <Button round
                  id={`ee-cn-ch-${chapter.id}`}
                  classNames="ee-cn-ch-li-ch"
                  color={currChapterId === chapter.id ? "teal" : 'transparent'}
                  onClick={epub.navigateChapter(chapter)}
                >
                  {isEditingEpub ? '' : `${chapterIndex + 1} - `} {chapter.title}
                </Button>
                {
                  (isEditingEpub || currChapter.id === chapter.id)
                  &&
                  chapter.subChapters.map((subChapter, subChapterIndex) => (
                    <Button round
                      id={`ee-cn-sub-ch-${subChapter.id}`}
                      key={`ee-cn-sub-ch-${subChapter.id}`}
                      classNames="ee-cn-ch-li-sub-ch"
                      color={currChapterId === subChapter.id ? "teal" : 'transparent'}
                      onClick={epub.navigateSubChapter(subChapter, chapter)}
                    >
                      {
                        isEditingEpub 
                        ? ('--- ' + subChapter.title)
                        : `${chapterIndex + 1}.${subChapterIndex + 1} - ${subChapter.title}`
                      }
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
        onClick={epub.showNavigator}
      />
    </div>
  );
}

export default connectWithRedux(
  ChapterNavigatorWithRedux,
  ['isEditingEpub'],
  []
);
