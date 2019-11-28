import React from 'react'
import { Popup } from 'semantic-ui-react'
import { 
  // searchControl, 
  videoControl,
  prettierTimeStr,
  timeStrToSec,
  SEARCH_INIT, SEARCH_RESULT, ARRAY_INIT, ARRAY_EMPTY, WEBVTT_DESCRIPTIONS,
} from '../../../Utils'
import './index.css'

function ResultList({
  search=SEARCH_INIT
}) {

  const { results=[], value='' } = search
  const handleSeek = time => () => {
    videoControl.currTime(timeStrToSec(time))
  }

  return (
    <div className="watch-search-result-container">
      {
        search.results === ARRAY_INIT ?
        null
        :
        search.results === ARRAY_EMPTY ?
        <div className="search-result-empty">
          {value && <div className="search-result-term">Found 0 result for '{value}'</div>}
        </div>
        :
        <div role="list" className="search-result-list">
          {value && <div className="search-result-term">Found {results.length} result(s) for '{value}'</div>}
          {results.map( (item, index) => (
            <Popup inverted wide basic
              position="top left"
              openOnTriggerClick={false}
              openOnTriggerFocus
              closeOnTriggerBlur
              content={`Seek to this ${item.kind === WEBVTT_DESCRIPTIONS ? 'description' : 'caption'}`}
              trigger={
                <button 
                  role="listitem" 
                  className="plain-btn search-result-listitem"
                  onClick={handleSeek(item.begin)}
                  key={`search-result-#${index}`}
                >
                  <div className="search-result-time">{prettierTimeStr(item.begin)}</div>
                  <p className="search-result-text" kind={item.kind}>
                    {item.kind === WEBVTT_DESCRIPTIONS && <span>(Description)<br/></span>}
                    {item.text}
                  </p>
                </button>
              }
            />
          ))}
        </div>
      }
    </div>
  )
}

export default ResultList