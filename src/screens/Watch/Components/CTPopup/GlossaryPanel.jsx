import React, { useState, useEffect } from "react";
import './CTPopup.scss'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';


function GlossaryPanel(props) {
  const { time, glossaries, setTerm } = props;
  const [glossariesToDisplay, setGlossariesToDisplay] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  // Used to update the index after selecting a mode(tab) from one of "A-Z" and "time".
  const [sortMethodIndex, selectSortMethodIndex] = useState(0);
  const SORT_MODE_AZ = 0;
  const SORT_MODE_TIME = 1;

  // If current sort mode is A-Z, update display whenever searchkeyword changes.
  useEffect(() => {
    if (sortMethodIndex === SORT_MODE_AZ) {
      let newGlossariesToDisplay = glossaries;
      newGlossariesToDisplay.sort((a, b) => {
        if (a.word < b.word) {
          return -1;
        }
        if (a.word > b.word) {
          return 1;
        }
        return 0;
      });
      newGlossariesToDisplay = newGlossariesToDisplay.filter(glossaryEntry => {
        return glossaryEntry.word.toLowerCase().includes(searchKeyword.toLowerCase());
      });
      setGlossariesToDisplay(newGlossariesToDisplay);
    }
  }, [glossaries, searchKeyword, sortMethodIndex]);

  // If current sort mode is time, update display whenever time or searchkeyword changes.
  useEffect(() => {
    if (sortMethodIndex === SORT_MODE_TIME) {
      const curstamp = parseInt(time);
      const newShow = glossaries.filter(glossaryEntry => glossaryEntry.begin <= curstamp && glossaryEntry.end >= curstamp);
      setGlossariesToDisplay([...newShow]);
    }
  }, [time, sortMethodIndex]);



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
            {glossariesToDisplay.map((element) => 
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
            {glossariesToDisplay.map((element) => 
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