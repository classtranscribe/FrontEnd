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

    const createVttFile = () => {
      const header = "WEBVTT\n";
      const lines = transcript.map(vtcue => {
        const cueStart = vtcue.startTime.toFixed(2);
        const cueEnd = vtcue.endTime.toFixed(2);
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

// export default LiveTranscriptDownload;
const LiveTranscriptDownload = connect(({watch: {transcript}}) => ({
    transcript
}))(LiveTranscriptDownloadWithRedux);
export default LiveTranscriptDownload;
// export const MediaSettings = connect(({ mediasetting, loading }) => ({
//   mediasetting
// }))(MediaSettingsWithRedux);