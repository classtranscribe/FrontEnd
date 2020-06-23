import React from 'react';
import PropTypes from 'prop-types';
import {
    CTFragment,
    CTForm, 
    CTFormRow, 
    CTInput,
    CTFormHelp,
    CTUploadButton
} from 'layout';
import _ from 'lodash';
import { user, uemail } from 'utils';

function UploadFile(props) {
  const {
    emails,
    setEmails,
    inputValue,
    setInputValue,
    error,
    setError
  } = props;

  const onLoadFile = async (event) => {
    let results = uemail.extract(event.target.result);
    if (!Array.isArray(results)) return;
    
    setEmails(oldEmails => ([...oldEmails, ..._.difference(results, oldEmails)]));
  };

  const handleFileUpload = (files) => {
    if (files.length > 0) {
      for (let i = 0; i < files.length; i += 1) {
        const reader = new FileReader()
        reader.onload = onLoadFile;
        reader.readAsText(files[i])
      }
    }
  };

  return (
    <CTFragment>
      <CTFormHelp title="INSTRUCTION">
        <CTFragment>
          Please upload a <strong>.csv/.txt file</strong> 
          with a <strong>list of emails</strong>.
        </CTFragment>
        <hr />
        <CTFragment className="email-list-uploadbtw-example">
          <h4><strong>EXAMPLAE</strong></h4>
          <CTFragment>{'<demo.txt>'}</CTFragment>
          <CTFragment>shawn@university.edu</CTFragment>
          <CTFragment>micheal2@university.edu</CTFragment>
          <CTFragment>xiaoming@university.edu</CTFragment>
          <CTFragment>...</CTFragment>
        </CTFragment>
      </CTFormHelp>
      <CTUploadButton 
        fluid 
        id="upload-email-list"
        onFileChange={handleFileUpload}
        accept=".csv,.txt"
      />
    </CTFragment>
  );
}

UploadFile.propTypes = {
    emails: PropTypes.array,
    setEmails: PropTypes.func,
    inputValue: PropTypes.string,
    setInputValue: PropTypes.func,
    error: PropTypes.array,
    setError: PropTypes.func
};

export default UploadFile;