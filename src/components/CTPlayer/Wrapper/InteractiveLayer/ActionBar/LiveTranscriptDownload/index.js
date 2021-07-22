import React from 'react';
import WatchCtrlButton from 'screens/Watch/Components/WatchCtrlButton'
import { connect } from 'dva';
import fileDownload from 'js-file-download';

function LiveTranscriptDownloadWithRedux(props) {
    const {media, transcript} = props;

    // filename safe based off: https://stackoverflow.com/questions/8485027/javascript-url-safe-filename-safe-string
    const generateFileName = (mediaName) => {
      const cleanMediaName = mediaName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const fileName = `${cleanMediaName}_transcript`;
      return fileName;
    };

    // https://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript
    // const timestampFormat = (seconds) => new Date(seconds * 1000).toISOString().substr(11, 12)

    // start and end times are borked, so disabling this for the time being
    // const createVttFile = () => {
    //   const header = "WEBVTT\n";
    //   const lines = transcript.map(vtcue => {
    //     if (vtcue === undefined || vtcue.text === undefined || vtcue.text === "") {
    //       return "";
    //     }
        
    //     const cueStart = timestampFormat(vtcue.startTime);
    //     const cueEnd = timestampFormat(vtcue.endTime)
    //     return `\n${cueStart} --> ${cueEnd}\n${vtcue.text}\n`;        
    //   });
    //   const textContent = header + lines.join("");
    //   return [textContent, "vtt"];
    // };

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
    const triggerDownload = () => {
        if (isTranscriptEmpty()) {
          return;
        }
        const [transcriptFile, ext] = createTextFile();
        const fileName = `${generateFileName(media.mediaName)}.${ext}`;
        fileDownload(transcriptFile, fileName);
    }
    
    return (
      <div>
        <WatchCtrlButton 
          onClick={triggerDownload}
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
      </div>
    );
}

const LiveTranscriptDownload = connect(({watch: {transcript}}) => ({
    transcript
}))(LiveTranscriptDownloadWithRedux);
export default LiveTranscriptDownload;
