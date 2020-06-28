import React from 'react';
import PropTypes from 'prop-types';
import {
    CTFragment,
    CTFormHelp,
    CTUploadButton,
    CTText
} from 'layout';
import _ from 'lodash';
import { user, uemail, prompt } from 'utils';

function UploadFile(props) {
  const {
    emails,
    setEmails,
  } = props;

  const onLoadFile = async (event) => {
    let results = uemail.extract(event.target.result);
    if (!Array.isArray(results)) return;
    
    setEmails(oldEmails => {
      let newEmails = _.difference(results, oldEmails);
      prompt.addOne({ text: `Added ${newEmails.length} emails.`, timeout: 3000 });
      return [...newEmails, ...oldEmails];
    });
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
          Please upload a text file (e.g. .csv/.txt) with a list of emails. 
          The emails can be separated by 
          <code> &apos;,&apos;</code>, 
          <code> &apos;;&apos;</code>, 
          <code> &apos;{'<>'}&apos;</code>, 
          <code> &apos;:&apos;</code>, 
          <code> space</code>, and 
          <code> breakline</code>
        </CTFragment>
        <hr />
        <CTFragment className="email-list-uploadbtw-example">
          <CTText bold>EXAMPLAES</CTText>
          <div>shawn@abc.edu,david@efg.com</div>
          <div>micheal@123.com;alice@456.edu</div>
          <div>micheal2@university.edu</div>
          <div>xiaoming@university.edu</div>
          <div>{'<lee1988@university.cs.edu>'}</div>
          <div>{'<alice2020@university.edu>'}</div>
          <div>...</div>
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