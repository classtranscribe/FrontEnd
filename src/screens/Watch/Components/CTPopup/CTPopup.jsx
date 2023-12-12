/* eslint-disable react/jsx-indent */
/* eslint-disable no-console */
/* eslint-disable complexity */
// import { parseSec } from 'screens/Watch/Utils';
import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.scss';
// import { ButtonGroup } from 'semantic-ui-react';
import { cthttp } from 'utils/cthttp/request';
import { env } from 'utils/env';
import { connect } from 'dva';
import Draggable from 'react-draggable';
import './CTPopup.scss'
import GlossaryPanel from './GlossaryPanel';

// marked for deletion - seems to be unused
// const ASLVideoPlayer = (word, videoURL, source) => {
//   return (
//     <TabPanel>
//       <strong>{`${word} (Source: ${source})`}</strong><br /><br />
//       {videoURL==='' ? (<span>video not found</span>) 
//       : 
//       (<video 
//         className="video-js vjs-default-skin video-player" 
//         controls
//         preload="auto"
//         data-setup="{}"
//       >
//         <source src={videoURL} type='video/mp4' />
//        </video>)}
//     </TabPanel>)
// }

const CTPopup = ({ time = 0 }) => {
  // const [opvalue, setOpvalue] = useState(0.95); // variable for transparency
  // const OPSTEP = 0.125 / 2; // the amount of changed opvalue for each operation
  const origin = env.baseURL || window.location.origin; // e.g. https://localhost https://ct-dev....
  // below are variables for videos and explanations for chosen glossary
  const [term, setTerm] = useState({
    word: '',
    explain: '',
    url: ''
  }); // set default to empty string
  const [signURL, setSignURL] = useState(''); // url should be set to '' when it does not exist
  const [definitionURL, setDefinitionURL] = useState('');
  const [exampleURL, setExampleURL] = useState('');


  // eslint-disable-next-line no-unused-vars
  const [show, setShow] = useState([{
    word: 'toy',
    begin: 0,
    end: 99999
  }])

  const [glossaries, setGlossaries] = useState([]);

  // stamp might be 00:00:00 or 00:00
  const parseTimestamp = (stamp) => {
    const nums = stamp.split(':');
    let sec = 0;
    let base = 1;
    for (let i = nums.length - 1; i >= 0; i -= 1) {
      sec += base * parseInt(nums[i], 10);
      base *= 60;
    }
    return sec;
  }

  // const [queryParameters, getqueryParameters] = React.useState('0699a60e-3926-48c6-9e28-01f3c2d35c10');
  useEffect(() => {
    async function fetchData() {
      const queryParameter = new URLSearchParams(window.location.search);
      const mid = queryParameter.get('id');
      const ret = await cthttp.get(`Media/${mid}`);
      const vid = ret.data.video.id;
      const res2 = await cthttp.get(`Task/GetGlossaryTimestamp?videoId=${vid}`);
      const times = res2.data.glossaryTimestamp;
      const res = await cthttp.get(`Task/GetGlossary?videoId=${vid}`); // English And potentially ASL Glossary entries
      
      const gdata = [];
      const keys = {};
      let tiebreaker = 0;
      res.data.Glossary.forEach(element => {
        const curdata = {
          word: element[0],
          explain: element[1],
          source: element[3],
          url: element[5],
          detail: element[6],
        };
        const curword = element[0];
        let basekey = curword;
        const curstamp = times[curword];
        if (curstamp !== undefined) {
          curdata.begin = parseTimestamp(curstamp[0].substring(0, 8));
          curdata.end = parseTimestamp(curstamp[1].substring(0, 8));
          basekey = `${curdata.begin}-${curdata.end}-${basekey}`;
        } 
        let key = basekey;

        while (keys[key] !== undefined) {
          tiebreaker += 1;
          key = `${tiebreaker}-${basekey}`;
        }
        keys[key] = true;
        curdata.key = key;
        gdata.push(curdata);
      });

      setGlossaries(gdata);
      const curstamp = parseInt(time, 10);
      const newShow = glossaries.filter(word => word.begin <= curstamp && word.end >= curstamp);
      setShow([...newShow]);
    }
    fetchData();
  }, []);



  useEffect(() => {
    async function fetchData(word) {
      setSignURL('');
      setDefinitionURL('');
      setExampleURL('');
      if (word.length > 0) {
        // current term is not empty
        const ret = await cthttp.get(`ASLVideo/GetASLVideosByTerm?term=${term.word}`);
        if (ret.status === 200) {
          // request success
          ret.data.forEach(element => {
            const URL = `${origin}/data/aslvideos/${element.source.toLowerCase()}/original/${element.uniqueASLIdentifier}.mp4`
            element.URL = URL;
            
            
            if (element.kind === 1) {
              setSignURL(element);
            } else if (element.kind === 2) {
              setDefinitionURL(element);
            } else if (element.kind === 3) {
              setExampleURL(element);
            }
          })
        }
        else {
          // eslint-disable-next-line no-console
          console.log(`No data for ${term.word}. result status: ${ret.status}`)
        }
      }
    }
    fetchData(term.word);
  }, [term]);

  const glossaryOuterStyle = {
    // color: 'blue',
    // visibility: disp,
    opacity: 0.98,
  };

  // const btngpStyle = {
  //   // color: 'blue',
  //   // visibility: disp,
  //   float: 'right',
  // };

  // used for transparency
  // const addOpValue = () => {
  //   if (opvalue >= 1.0 - OPSTEP) {
  //     setOpvalue(1.0);
  //   }
  //   else {
  //     setOpvalue(opvalue + OPSTEP);
  //   }
  // }

  // // used for transparency
  // const subOpValue = () => {
  //   if (opvalue <= OPSTEP * 2) {
  //     setOpvalue(OPSTEP);
  //   }
  //   else {
  //     setOpvalue(opvalue - OPSTEP);
  //   }
  // }

  // // used for transparency
  // const toPercent = (value) => {
  //   let str = Number(value * 100);
  //   str += "%";
  //   return str;
  // }
  // const aslIcon = <i className="material-icons">asl</i>;

  const cite = (t) => (<><a target="_blank" rel="noopener noreferrer" href={t.websiteURL}>More information</a></>)

  return (
    <Draggable cancel='.search-bar'>
      <div style={glossaryOuterStyle} className="video1 video2">
        {/* <div className='buttons'>
          <ButtonGroup style={btngpStyle}>
            <button className='button'> {toPercent(opvalue)} </button>
            <button className='button' onClick={subOpValue}>-</button>
            <button className='button' onClick={addOpValue}>+</button>
          </ButtonGroup>
        </div> */}

        <Tabs className='detail-div'>
          <Tabs>
            <TabList>
              <Tab>{term.word || 'English'}</Tab>
              {((signURL+definitionURL+exampleURL) !=='') && (<> ASL</>)}
              {signURL !== '' && (<Tab>Sign</Tab>)}
              {definitionURL !== '' && (<Tab>Definition</Tab>)}
              {exampleURL !== '' && (<Tab>Example</Tab>)}
            </TabList>
            <TabPanel className='divPanel'>
              <strong>{term.word}</strong>
              <span className='nowrap'>{term.explain}</span>
              {(term.url?.length>0) && <a href={term.url} target='_blank' rel="noreferrer">Read more</a>}
            </TabPanel>
            {signURL !== '' && (
            <TabPanel>
              {signURL === '' ? (<span>sign video for this term is not found</span>)
                    :
                    (<>
                      <video
                        className="video-js vjs-default-skin video-player"
                        controls
                        preload="auto"
                        data-setup="{}"
                        autoPlay
                        muted
                      ><source src={signURL.URL} type='video/mp4' />
                      </video>
                      {cite(signURL)}
                     </>)}
            </TabPanel>)}
            {definitionURL !== '' && (
            <TabPanel>
                 
              {definitionURL === '' ? (<span>definition video for this term is not found</span>)
                    :
                    (<><video
                      className="video-js vjs-default-skin video-player"
                      controls
                      preload="auto"
                      data-setup="{}"
                      autoPlay
                      muted
                    >
                      <source src={definitionURL.URL} type='video/mp4' />
                       </video>{cite(definitionURL)}
                     </>)}
            </TabPanel>)}
            {exampleURL !== '' && (
            <TabPanel>
                 
              {exampleURL === '' ? (<span>example video for this term is not found</span>)
                    :
                    (<><video
                      className="video-js vjs-default-skin video-player"
                      controls
                      preload="auto"
                      data-setup="{}"
                      autoPlay
                      muted
                    ><source src={exampleURL.URL} type='video/mp4' />
                       </video>{cite(exampleURL)}
                     </>)}
            </TabPanel>)}
          </Tabs>
        
        </Tabs>

        <GlossaryPanel
          glossaries={glossaries}
          time={time}
          setTerm={setTerm}
        />

      </div>
    </Draggable>
  )
};

// export default CTPopup;

export default connect(({ watch: { time, duration, liveMode } }) => ({
  time, duration, liveMode
}))(CTPopup);