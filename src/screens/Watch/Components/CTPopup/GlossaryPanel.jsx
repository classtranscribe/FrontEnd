import React, { useState, useEffect, useRef, useCallback } from "react";
import './CTPopup.scss'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';


function GlossaryPanel(props) {
  const { time, glossaries, setTerm } = props;
  const [glossariesToDisplay, setGlossariesToDisplay] = useState([[], []]);
  const [searchKeyword, setSearchKeyword] = useState('');
  // Used to update the index after selecting a mode(tab) from one of "A-Z" and "time".
  const [sortMethodIndex, selectSortMethodIndex] = useState(0);
  const SORT_MODE_AZ = 0;
  const SORT_MODE_TIME = 1;
  const NO_HIGHLIGHT = 0;
  const FIRST_HIGHLIGHT = 1;
  const HIGHLIGHT = 2;
  // const scrollCallback = useCallback((element) => {
  //   console.log(element);
  //   if (element) {
  //     window.scrollTo({behavior: 'smooth', top: element.offsetTop})
  //   }
  // }, [time]);
  const scrollRef = useRef(null);
 

  // update todisplay of az whenever searchkeyword changes.
  useEffect(() => {
    let toDisplay = glossaries;
    toDisplay.sort((a, b) => {
      if (a.word < b.word) {
        return -1;
      }
      if (a.word > b.word) {
        return 1;
      }
      return 0;
    });
    // sort the words.
    toDisplay = toDisplay.filter(glossaryEntry => {
      return glossaryEntry.word.toLowerCase().includes(searchKeyword.toLowerCase());
    });

    // update the appropriate row in glossariestodisplay
    setGlossariesToDisplay(glossariesToDisplay.map((list, index) => {
      if (index === SORT_MODE_AZ) {
        return toDisplay;
      }
      return list;
    }));
  }, [searchKeyword]);

  // If current sort mode is time, update display whenever time or searchkeyword changes.
  useEffect(() => {
    const curstamp = parseInt(time);
    // If the time of the glossary includes current time, we 
    // should make it highlighted.
    // Also, if this is the fist element we should highlight, 
    // we mark it to make it scroll to the top of the display.
    let firstHighlightMarked = false;
    let toDisplay = glossaries;
    toDisplay.sort((a, b) => a.begin - b.begin);
    toDisplay = toDisplay.map(glossaryEntry => {
      if (glossaryEntry.begin <= curstamp && glossaryEntry.end >= curstamp) {
        if (firstHighlightMarked) {
          return {...glossaryEntry, highlight: HIGHLIGHT};
        }
        firstHighlightMarked = true;
        return {...glossaryEntry, highlight: FIRST_HIGHLIGHT}
      }
      return {...glossaryEntry, highlight: NO_HIGHLIGHT};
    });
    // sort the glossaries by start of timestamp.

    setGlossariesToDisplay(glossariesToDisplay.map((list, index) => {
      if (index === SORT_MODE_TIME) {
        return toDisplay;
      }
      return list;
    }));
  }, [time]);

  // After updating the glossaries, scroll it to the appropriate position.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  }, [glossariesToDisplay[SORT_MODE_TIME]]);


  function onSelectGlossariesOrderMode(index) {
    selectSortMethodIndex(index);
  }

  return (
    <div className='gloPanel'>

      <Tabs 
        className='detail-div'
        onSelect={(index) => onSelectGlossariesOrderMode(index)}
      >
        
        <TabList>
          <Tab>A-Z</Tab> {/* index = 0 */}
          <Tab>Time</Tab> {/* index = 1 */}
        </TabList>
        <input
          className="search-bar"
          type='text'
          onChange={(e) => {
              setSearchKeyword(e.target.value);
            }}
          value={searchKeyword}
        />

        <TabPanel className='glossary-list-container'>

          <ul>
            {glossariesToDisplay[SORT_MODE_AZ].map((element) => 
              <li className='glossary-entry' key={element.word}>
                <button onClick={() => setTerm(element)}>
                  <span>
                    {element.word}
                  </span>
                </button>
              </li>
            )}
          </ul>
        </TabPanel>
        <TabPanel className='glossary-list-container'>
          <ul>
            {/* Render the appropriate glossaries. */}
            {glossariesToDisplay[SORT_MODE_TIME].map((element) => {              
              // Highlight needed glossaries.
              if (element.highlight !== NO_HIGHLIGHT) {
                return (
                  <li 
                    className='glossary-entry-highlighted'
                    key={element.word}
                    // If this is the first highlighted glossary, set scrollRef, which
                    // is necessary in order to scroll to its position.
                    ref={element.highlight === FIRST_HIGHLIGHT ? scrollRef : undefined}
                  >
                    <button onClick={() => setTerm(element)}>
                      <span>
                        {element.word}
                      </span>
                    </button>
                  </li>);
              }
              return (
                <li key={element.word} className='glossary-entry'>
                  <button onClick={() => setTerm(element)}>
                    <span>
                      {element.word}
                    </span>
                  </button>
                </li>);
            })}
          </ul>
        </TabPanel>
      </Tabs>

    </div>
  );
}

export default GlossaryPanel;