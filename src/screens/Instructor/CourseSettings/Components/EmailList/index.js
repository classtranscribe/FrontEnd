import React, {useState} from 'react';
import {
  CTFragment,
  CTForm, 
  CTFormRow, 
  CTInput,
  CTFormHelp,
  CTUploadButton
} from 'layout';
import { Button } from 'pico-ui';
import _ from 'lodash';
import { user, uemail } from 'utils';
import { EmailFilter } from '../EmailFilter' 
import './index.scss';


function EmailListWithRedux(props) {
  let { title, description, onSave } = props;
  const [emails, setEmails] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);

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
    <CTFragment className="email-list-container">
      <CTForm
        collapsible
        id="email-list" 
        padding={[10, 35]}
        heading={title}
        details={description}
        onSave={onSave}
      >     
        <CTFormRow>
          <CTFragment className="email-list-left">
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

          <CTFragment className="email-list-right">
            <EmailFilter 
              emails={emails}
              setEmails={setEmails}
              inputValue={inputValue}
              setInputValue={setInputValue}
              error={error}
              setError={setError}
            />
          </CTFragment>
          
        </CTFormRow>
      </CTForm>
    </CTFragment>
  );
}

export const EmailList = EmailListWithRedux;