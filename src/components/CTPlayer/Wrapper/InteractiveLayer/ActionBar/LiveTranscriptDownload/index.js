import React, {useRef} from 'react';
import WatchCtrlButton from 'screens/Watch/Components/WatchCtrlButton'
import { connect } from 'dva';
import fileDownload from 'js-file-download';
import {Menu, MenuItem} from '@material-ui/core';
import { MENU_DOWNLOAD } from 'screens/Watch/Utils/constants.util'
// import { CTDropdown } from 'layout'; // TODO: Change the Menu to use this

function LiveTranscriptDownloadWithRedux(props) {
    const {media, transcript, menu, dispatch} = props;

    const anchorRef = useRef(null);
    
    // filename safe based off: https://stackoverflow.com/questions/8485027/javascript-url-safe-filename-safe-string
    const generateFileName = (mediaName) => {
      const cleanMediaName = mediaName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const fileName = `${cleanMediaName}_transcript`;
      return fileName;
    };

    // https://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript
    const formatTimeStamp = (seconds) => new Date(seconds * 1000).toISOString().substr(11, 12);
    const invalidVtCue = (vtcue) => vtcue === undefined || vtcue.text === undefined || vtcue.text === ""

    const createVttFile = () => {
      const header = "WEBVTT\n";
      const lines = transcript.map(vtcue => {
        if (invalidVtCue(vtcue)) {
          return "";
        }
        
        const cueStart = formatTimeStamp(vtcue.startTime);
        const cueEnd = formatTimeStamp(vtcue.endTime)
        return `\n${cueStart} --> ${cueEnd}\n${vtcue.text}\n`;        
      });
      const textContent = header + lines.join("");
      return [textContent,"vtt"];
    };

    const createTextFile = () => {
      const lines = transcript.map(vtcue => {
        if (invalidVtCue(vtcue)) {
          return "";
        }

        return `${vtcue.text}\n\n`;
      });
      const textContent = lines.join("");
      return [textContent, "txt"];
    }

    const isTranscriptEmpty = () => transcript.length === 1 && transcript[0] === 'empty';
    const triggerDownload = (args) => {
        if (isTranscriptEmpty()) {
          return;
        }
        const [transcriptFile, ext] = args;
        const fileName = `${generateFileName(media.mediaName)}.${ext}`;
        fileDownload(transcriptFile, fileName);
    }

    // const handleChange = (value) => {
    //   switch (value) {
    //     case "vtt":
    //       triggerDownload(createVttFile());
    //       break;
        
    //     case "txt":
    //       triggerDownload(createTextFile());
    //       break;

    //     default:
    //       break;
    //   }
    // }

    // const downloadOptions = [
    //   {
    //     value: 'txt',
    //     text: 'Text file (.txt)',
    //   },
    //   {
    //     value: 'vtt',
    //     text: 'VTT file (.vtt)'
    //   }
    // ];

    const downloadVtt = () => triggerDownload(createVttFile());
    const downloadText = () => triggerDownload(createTextFile());

    const openMenu = () => dispatch({ type: 'watch/menu_open', payload: { type: MENU_DOWNLOAD, option: 'b' } });
    const closeMenu = () => dispatch({ type: 'watch/menu_close' });
    
    const shouldDisplayMenu = menu === MENU_DOWNLOAD;

    return (
      <div ref={anchorRef}>
        <WatchCtrlButton 
          onClick={openMenu}
          position="top"
          label="Download (SHIFT+X)"
          id="live-transcript-download"
          ariaTags={{
            'aria-label': `Download Menu`,
            'aria-keyshortcuts': 'Shift+X',
          }}
        >
          <span><i className="material-icons">cloud_download</i></span>   
        </WatchCtrlButton>

        <Menu
          id="simple-menu"
          anchorEl={anchorRef.current}
          keepMounted
          open={shouldDisplayMenu}
          onClose={closeMenu}
        >
          <MenuItem onClick={downloadVtt}>VTT</MenuItem>
          <MenuItem onClick={downloadText}>Text</MenuItem>
        </Menu>
        {/* <CTDropdown 
          id="live-transcript-download-dropdown"
          anchorRef={anchorRef}
          open={shouldDisplayMenu}
          onClose={closeMenu}
          onChange={handleChange}
          downloadOptions={downloadOptions}
        /> */}
      </div>
    );
}

const LiveTranscriptDownload = connect(({watch: {transcript, menu}}) => ({
    transcript, menu
}))(LiveTranscriptDownloadWithRedux);
export default LiveTranscriptDownload;
