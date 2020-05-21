import React, { useState, useCallback } from 'react';
import _ from 'lodash';
import { Button } from 'semantic-ui-react';
import { useDropzone } from 'react-dropzone';

function UploadButton({ addMedia, disabled }) {
  const [mesg, setMesg] = useState('');

  const onChange = useCallback(
    ({ target: { files } }) => {
      if (files.length > 2) {
        setMesg(`You can upload at most 2 videos for one media. Please select files again.`);
        return;
      }

      setMesg('');
      addMedia(files[0], files[1]);
      // console.log('files', files)
    },
    [addMedia],
  );

  const { getRootProps, getInputProps } = useDropzone();

  return (
    <div className="ip-upload-btn ct-d-c-center mt-3">
      <Button type="button" size="big" disabled={disabled} {...getRootProps()}>
        <input {...getInputProps()} accept=".mp4" onChange={onChange} />
        Browse Files
      </Button>
      <span>{mesg}</span>
    </div>
  );
}

export default UploadButton;
