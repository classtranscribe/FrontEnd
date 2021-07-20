import React from 'react';
import WatchCtrlButton from 'screens/Watch/Components/WatchCtrlButton'
import { connect } from 'dva';
import fileDownload from 'js-file-download';

function LiveTranscriptDownloadWithRedux(props) {
    const {media, transcript} = props;

    // filename safe based off: https://stackoverflow.com/questions/8485027/javascript-url-safe-filename-safe-string
    const getFileName = (mediaName) => {
      const cleanMediaName = mediaName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const fileName = `${cleanMediaName}_transcript.vtt`;
      return fileName;
    };

    const timestampFormat = (seconds) => new Date(seconds * 1000).toISOString().substr(11, 12)

    const createVttFile = () => {
      const header = "WEBVTT\n";
      const lines = transcript.map(vtcue => {
        const cueStart = timestampFormat(vtcue.startTime);
        const cueEnd = timestampFormat(vtcue.endTime)
        return `\n${cueStart} --> ${cueEnd}\n${vtcue.text}\n`;
      });
      const textContent = header + lines.join("");
      return textContent;
    };

    const isTranscriptEmpty = () => transcript.length === 1 && transcript[0] === 'empty';
    const triggerDownload = () => {
        console.log(transcript);
        if (isTranscriptEmpty()) {
          return;
        }
        const fileName = getFileName(media.mediaName);
        const vttFile = createVttFile();
        fileDownload(vttFile, fileName);
    }
    return (
      <div>
        <WatchCtrlButton 
          onClick={triggerDownload}
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
