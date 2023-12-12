import React, { useState, useEffect } from "react";
import './CTPopup.scss'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';


function GlossaryPanel(props) {
  const { time, glossaries, setTerm } = props;
  const [sortByChar, setSortByChar] = useState([]); // sorted glossary based on character
  const [sortByTime, setSortByTime] = useState([]); // sorted glossary based on begin time
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // when glossaries changed, we changed two sorted version of glossaries
  useEffect(() => {
    const byChar = [...glossaries];
    const byTime = [...glossaries];
    // eslint-disable-next-line no-console, no-alert

    byChar.sort((a, b) => {
      if (a.word.toLowerCase() < b.word.toLowerCase()) {
        return -1;
      }
      if (a.word.toLowerCase() > b.word.toLowerCase()) {
        return 1;
      }
      return 0;
    });

    byTime.sort((a, b) => {
      return a.begin - b.begin
    })
    setSortByChar(byChar);
    setSortByTime(byTime);
  }, [glossaries])

  // we find the first glossary, and scroll to it
  useEffect(() => {
    const curstamp = parseInt(time, 10);
    const firstHiIndex = sortByTime.findIndex((entry) =>{
      return (entry.begin <= curstamp && entry.end >= curstamp);
    })
    if (firstHiIndex !== -1) {
      let z = document.getElementById(`glossary-item-${firstHiIndex}`);
      if (z != null) {
        z.scrollIntoView({behavior:'smooth',block: "start"});
      }
    }
  }, [time])
  

  return (
    <div className='gloPanel'>

      <Tabs className='detail-div'>
        
        <TabList className='list-tabs'>
          <Tab>A-Z</Tab> {/* index = 0 */}
          <Tab>Time</Tab> {/* index = 1 */}
        </TabList>

        {/* Tab panel for Letter order. */}
        <TabPanel className='glossary-list-container'>
          <input
            className="search-bar"
            type='text'
            onChange={(e) => { setSearchKeyword(e.target.value); }}
            value={searchKeyword}
            placeholder="Search for Terms"
          />
          <div className="glossary-scrollable-char">
            <ul>
              {sortByChar.filter(glossaryEntry => {
                return glossaryEntry.word.toLowerCase().includes(searchKeyword.toLowerCase());
                }).map((element) => 
                  <li className='glossary-entry' key={element.key}>
                    <button onClick={() => setTerm(element)}>
                      <span>
                        {element.word}
                      </span>
                    </button>
                  </li>
              )}
            </ul>
          </div>
        </TabPanel>

        {/* Tab Panel for Time order. */}
        <TabPanel className='glossary-list-container'>
          <div className="glossary-scrollable">
            <ul>
              {sortByTime.map((element) => {              
                if (element.begin <= time && element.end >= time) {
                  // height light
                  return (
                    <li 
                      className='glossary-entry glossary-entry-highlighted'
                      key={element.key}
                      id={`glossary-item-${element.key}`}
                    >
                      <button onClick={() => setTerm(element)}>
                        <span>
                          {element.word}
                        </span>
                      </button>
                    </li>
                  )
                } 
                  // not
                  return (
                    <li 
                      className='glossary-entry'
                      key={element.key}
                      id={`glossary-item-${element.key}`}
                    >
                      <button onClick={() => setTerm(element)}>
                        <span>
                          {element.word}
                        </span>
                      </button>
                    </li>
                  )
              })}
            </ul>
          </div>
        </TabPanel>
      </Tabs>

    </div>
  );
}

export default GlossaryPanel;