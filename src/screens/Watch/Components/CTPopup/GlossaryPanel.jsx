import React, { useState, useEffect, useRef } from "react";
import './CTPopup.scss'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { elem } from "utils";


function GlossaryPanel(props) {
  const { time, glossaries, setTerm } = props;
  const [sortByChar, setSortByChar] = useState([]); //sorted glossary based on character
  const [sortByTime, setSortByTime] = useState([]); //sorted glossary based on begin time
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // when glossaries changed, we changed two sorted version of glossaries
  useEffect(() => {
    const byChar = [...glossaries];
    const byTime = [...glossaries];
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
    console.log(byTime);
  }, [glossaries])

  // we find the first glossary, and scroll to it
  useEffect(() => {
    const curstamp = parseInt(time);
    const firstHiIndex = sortByTime.findIndex((entry) =>{
      return (entry.begin <= curstamp && entry.end >= curstamp);
    })
    if (firstHiIndex != -1) {
      let z = document.getElementById(`glossary-item-${firstHiIndex}`);
      if (z != null) {
        z.scrollIntoView({behavior:'smooth',block: "start"});
      }
    }
  }, [time])
  
  return (
    <div className='gloPanel' >

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
            onChange={(e) => {
                setSearchKeyword(e.target.value);
              }}
            value={searchKeyword}
          />
          <div className="glossary-scrollable-char">
            <ul>
              {sortByChar.filter(glossaryEntry => {
                return glossaryEntry.word.toLowerCase().includes(searchKeyword.toLowerCase());
                }).map((element, index) => 
                <li className='glossary-entry' key={index}>
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
              {sortByTime.map((element, index) => {              
                if (element.begin <= time && element.end >= time) {
                  // height light
                  return (
                    <li 
                      className='glossary-entry glossary-entry-highlighted'
                      key={index}
                      id={`glossary-item-${index}`}
                    >
                      <button onClick={() => setTerm(element)}>
                        <span>
                          {element.word}
                        </span>
                      </button>
                    </li>
                  )
                } else {
                  // not
                  return (
                    <li 
                      className='glossary-entry'
                      key={index}
                      id={`glossary-item-${index}`}
                    >
                      <button onClick={() => setTerm(element)}>
                        <span>
                          {element.word}
                        </span>
                      </button>
                    </li>
                  )
                }
              })}
            </ul>
          </div>
        </TabPanel>
      </Tabs>

    </div>
  );
}

export default GlossaryPanel;