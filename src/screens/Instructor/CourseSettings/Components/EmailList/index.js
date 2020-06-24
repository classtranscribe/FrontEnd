import React, {useState} from 'react';
import {
  CTFragment,
  CTForm, 
  CTFormRow
} from 'layout';
import EmailFilter from './EmailFilter';
import UploadFile from './UploadFile';
import './index.scss';

const sampleEmails = [
  'shawn@gmail.com',
  'david@illinois.edu',
  'alice@illinois.edu',
  'michael@gmail.com'
];

function EmailListWithRedux(props) {
  let { title, description, onSave } = props;
  const [emails, setEmails] = useState(sampleEmails);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);

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
            <UploadFile
              emails={emails}
              setEmails={setEmails}
              inputValue={inputValue}
              setInputValue={setInputValue}
              error={error}
              setError={setError}
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