import React, { useState, useCallback } from 'react';
import _ from 'lodash';
import Papa from 'papaparse';
import { Button } from 'semantic-ui-react';
import { useDropzone } from 'react-dropzone';
import { InfoIcon } from '../../InfoIcon';

export function UploadBtn({ addNew }) {
  const [mesg, setMesg] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = useCallback(
    ({ target: { files } }) => {
      if (files.length > 1) {
        setMesg(`Only one file (${files[0].name}) was read.`);
      }
      setLoading(true);
      let reader = new FileReader();
      reader.onload = async function () {
        let { data } = Papa.parse(reader.result);
        // console.log(_.flatten(data))
        addNew(_.flatten(data));
        setLoading(false);
      };
      reader.readAsBinaryString(files[0]);
    },
    [addNew],
  );

  const { getRootProps, getInputProps } = useDropzone();

  return (
    <div className="ip-upload-btn ct-list-col ">
      <Button type="button" {...getRootProps()} loading={loading}>
        <input {...getInputProps()} accept=".csv,.txt" onChange={onChange} />
        Upload a csv/txt file
      </Button>
      <span>{mesg}</span>

      {/* Instructions */}
      <span className="text-muted">
        Please upload a <strong>.csv/.txt file</strong> with a <strong>list of emails</strong>.
        <InfoIcon
          header="Example"
          content={
            <div className="csv-demo ct-list-col" aria-hidden="true">
              <div>{'<demo.txt>'}</div>
              <div>shawn@university.edu</div>
              <div>micheal2@university.edu</div>
              <div>xiaoming@university.edu</div>
              <div>...</div>
            </div>
          }
        />
      </span>
    </div>
  );
}
