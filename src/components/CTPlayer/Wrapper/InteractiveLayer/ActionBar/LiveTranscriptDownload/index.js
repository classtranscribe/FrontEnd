import React, {useState} from 'react';
import WatchCtrlButton from 'screens/Watch/Components/WatchCtrlButton'
import { connect } from 'dva';
import fileDownload from 'js-file-download';
import {Menu, MenuItem} from '@material-ui/core';

function LiveTranscriptDownloadWithRedux(props) {
    const {media, transcript} = props;

    const [downloadDisplay, setDownloadDisplay] = useState(false);

    // filename safe based off: https://stackoverflow.com/questions/8485027/javascript-url-safe-filename-safe-string
    const generateFileName = (mediaName) => {
      const cleanMediaName = mediaName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const fileName = `${cleanMediaName}_transcript`;
      return fileName;
    };

    // https://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript
    const formatTimeStamp = (seconds) => new Date(seconds * 1000).toISOString().substr(11, 12)

    const createVttFile = () => {
      const header = "WEBVTT\n";
      const lines = transcript.map(vtcue => {
        if (vtcue === undefined || vtcue.text === undefined || vtcue.text === "") {
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
        if (vtcue === undefined || vtcue.text === undefined || vtcue.text === "") {
          return "";
        }

        return `${vtcue.text}\n`;
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

    const downloadVtt = () => triggerDownload(createVttFile());
    const downloadText = () => triggerDownload(createTextFile());

    const openMenu = () => setDownloadDisplay(true);
    const closeMenu = () => setDownloadDisplay(false);
    
    return (
      <div>
        <WatchCtrlButton 
          onClick={openMenu}
          position="top"
          label="Download"
          // label="Download (SHIFT+D)"
          id="live-transcript-download"
          ariaTags={{
            'aria-label': `Download Menu`,
            // 'aria-keyshortcuts': 'Shift+D',
          }}
        >
          <span><i className="material-icons">cloud_download</i></span>   
        </WatchCtrlButton>

        <Menu
          id="simple-menu"
          anchorEl={downloadDisplay}
          keepMounted
          open={Boolean(downloadDisplay)}
          onClose={closeMenu}
        >
          <MenuItem onClick={downloadVtt}>VTT</MenuItem>
          <MenuItem onClick={downloadText}>Text</MenuItem>
        </Menu>
      </div>
    );
}

const LiveTranscriptDownload = connect(({watch: {transcript, menu}}) => ({
    transcript, menu
}))(LiveTranscriptDownloadWithRedux);
export default LiveTranscriptDownload;
