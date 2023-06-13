import React, { useState, useEffect } from "react";
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
    // if the time of the glossary includes current time, we 
    // should make it highlighted.
    const toDisplay = glossaries.map(glossaryEntry => {
      if (glossaryEntry.begin <= curstamp && glossaryEntry.end >= curstamp) {
        return {...glossaryEntry, highlight: true}
      }
      return {...glossaryEntry, highlight: false}
    });
    // sort the glossaries by start of timestamp.
    toDisplay.sort((a, b) => a.begin - b.begin);

    setGlossariesToDisplay(glossariesToDisplay.map((list, index) => {
      if (index === SORT_MODE_TIME) {
        return toDisplay;
      }
      return list;
    }));
  }, [time]);



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
              <li className='glossary-entry'>
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
            {glossariesToDisplay[SORT_MODE_TIME].map((element) =>
              element.highlight 
              ?
                <li className='glossary-entry-highlighted'>
                  <button onClick={() => setTerm(element)}>
                    <span>
                      {element.word}
                    </span>
                  </button>
                </li>
              :
              <li className='glossary-entry'>
                <button onClick={() => setTerm(element)}>
                  <span>
                    {element.word}
                  </span>
                </button>
              </li>
            )}
          </ul>
        </TabPanel>
      </Tabs>

    </div>
  );
}

export default GlossaryPanel;