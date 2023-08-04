import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.scss';
import { ButtonGroup } from 'semantic-ui-react';
import { cthttp } from 'utils/cthttp/request';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';
import './CTPopup.scss'
import GlossaryPanel from './GlossaryPanel';

const ASLVideoPlayer = (word, videoURL, source) => {
  return (
    <TabPanel>
      <strong>{`${word} (Source: ${source})`}</strong><br /><br />
      {videoURL==='' ? (<span>video not found</span>) 
      : 
      (<video 
        className="video-js vjs-default-skin video-player" 
        controls
        preload="auto"
        data-setup="{}"
      >
        <source src={videoURL} type='video/mp4' />
       </video>)}
    </TabPanel>)
}

const CTPopup = ({ time = 0, duration = 0, liveMode = false }) => {
    const [opvalue, setOpvalue] = useState(0.75); // variable for transparency
    const OPSTEP = 0.125; // the amount of changed opvalue for each operation
    // const hostName = window.location.hostname;
    const hostName = "ct-dev.ncsa.illinois.edu"; // for local test
    // below are variables for videos and explanations for chosen glossary
    const [term, setTerm] = useState({}); // set default to empty string
    const [signSource, setSignSource] = useState('');
    const [definitionSource, setDefinitionSource] = useState('');
    const [exampleSource, setExampleSource] = useState('');
    const [signURL, setSignURL] = useState(''); // url should be set to '' when it does not exist
    const [definitionURL, setDefinitionURL] = useState('');
    const [exampleURL, setExampleURL] = useState('');


    // const show = useRef();
    const [show, setShow] = useState([{
      word: 'toy',
      begin: 0,
      end: 99999
    }])

    const [glossaries, setGlossaries] = useState([]);
    // const [videoId, setVideoId] = useState('');
    // const [mediaId, setMediaId] = useState('');

    // const [disp, setDisplay] = React.useState('visible');
    // const [btnstatus, setBtn] = React.useState('hide');
    // const [url, setUrl] = React.useState('http://localhost:3000/Density.mp4');
    // const [playing, setPlay] = React.useState(false);
    // const [playerstatus, setPlayerStatus] = React.useState('play');
    
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
        // setMediaId(mid);
        // console.log(`mediaId: ${mid}`);
        const ret = await cthttp.get(`Media/${mid}`);
        const vid = ret.data.video.id;
        // console.log(`videoId: ${vid}`); //f1ebd193-4590-4776-a910-226fe22f17c6
        // setVideoId(vid);
        const res2 = await cthttp.get(`Task/GetGlossaryTimestamp?videoId=${vid}`);
        const times = res2.data.glossaryTimestamp;
        const res = await cthttp.get(`Task/GetGlossary?videoId=${vid}`);
        // console.log(res);
        const gdata = [];
        res.data.Glossary.forEach(element => {
          const curdata = {
            word: element[0],
            explain: element[1],
            source: element[3],
            url: element[5],
            detail: element[6]
          };
          const curword = element[0];
          const curstamp = times[curword];
          if (curstamp !== undefined) {
            curdata.begin = parseTimestamp(curstamp[0].substring(0,8));
            curdata.end = parseTimestamp(curstamp[1].substring(0,8));
          } else {
            console.warn("words not found in time stamp");
          }
          // console.log(curdata);
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
        if (word && word.length > 0) {
          // current term is not empty
          const ret = await cthttp.get(`ASLVideo/GetASLVideosByTerm?term=${term.word}`);
          if (ret.status === 200) {
            // request success
            ret.data.forEach(element => {
              const URL = `https://${hostName}/data/aslvideos/${element.source.toLowerCase()}/original/${element.uniqueASLIdentifier}.mp4`
              // console.log(`${element.kind} ${URL}`);
              if (element.kind === 1) {
                setSignURL(URL);
                setSignSource(element.source);
              } else if (element.kind === 2) {
                setDefinitionURL(URL);
                setDefinitionSource(element.source);
              } else if (element.kind === 3) {
                setExampleURL(URL);
                setExampleSource(element.source);
              }
            })
          }
        }
      }
      fetchData(term.word);
    }, [term]);

    const divStyle = {
        // color: 'blue',
        // visibility: disp,
        opacity: opvalue,
    };

    const btngpStyle = {
        // color: 'blue',
        // visibility: disp,
        float: 'right',
    };

    // used for transparency
    const addOpValue = () => {
        if (opvalue >= 1.0-OPSTEP) {
            setOpvalue(1.0);
        }
        else {
            setOpvalue(opvalue + OPSTEP);
        }
    }

    // used for transparency
    const subOpValue = () => {
        if (opvalue <= OPSTEP*2) {
            setOpvalue(OPSTEP);
        }
        else {
            setOpvalue(opvalue - OPSTEP);
        }
    }

    // used for transparency
    const toPercent = (value) => {
        let str = Number(value * 100);
        str += "%";
        return str;
    }
    return (
      <Draggable cancel='.search-bar'>
        <div style={divStyle} className='video1 video2'>
          <div className='buttons'>
            <ButtonGroup style={btngpStyle}>
              <button className='button'> {toPercent(opvalue)} </button>
              <button className='button' onClick={subOpValue}>-</button>
              <button className='button' onClick={addOpValue}>+</button>
            </ButtonGroup>
          </div>

          <Tabs className='detail-div'>
            <TabList>
              <Tab>ASL Video</Tab>
              <Tab>English</Tab>
            </TabList>

            <TabPanel>
              <Tabs>
                <TabList>
                  {signURL !== '' && (<Tab>Sign</Tab>)}
                  {definitionURL !== '' && (<Tab>Definition</Tab>)}
                  {exampleURL !== '' && (<Tab>Example</Tab>)}
                </TabList>
                {signURL !== '' && ASLVideoPlayer(term.word, signURL, signSource)}
                {definitionURL !== '' && ASLVideoPlayer(term.word, definitionURL, definitionSource)}
                {exampleURL !== '' && ASLVideoPlayer(term.word, exampleURL, exampleSource)}
              </Tabs>
            </TabPanel>
            <TabPanel className='divPanel'>
              <strong>{term.word}</strong><br />
              <span className='nowrap'>{term.explain}</span><br />
              <span>{term.url}</span>
            </TabPanel>
                    

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
  time, duration, liveMode}))(CTPopup);