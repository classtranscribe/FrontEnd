import React, {useState} from 'react';
import {
  CTFragment,
  CTForm, 
  CTFormRow
} from 'layout';
import { Button } from 'pico-ui';
import _ from 'lodash';
import { user, uemail } from 'utils';
import EmailFilter from './EmailFilter';
import UploadFile from './UploadFile';
import './index.scss';


function EmailListWithRedux(props) {
  let { title, description, onSave } = props;
  const [emails, setEmails] = useState([]);
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