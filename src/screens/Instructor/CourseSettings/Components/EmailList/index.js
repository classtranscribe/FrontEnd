import React, {useState} from 'react';
import {
  CTFragment,
  CTForm, 
  CTFormRow, 
  CTInput
} from 'layout';
import { Button } from 'pico-ui';
import _ from 'lodash';
import { uurl } from 'utils/use-url';
import { UploadButton } from '../UploadButton'
import './index.scss';

function EmailListWithRedux() {
  const [emails, setEmails] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);

  const handleInputChange = ({ target: { value }}) => setInputValue(value);

  const addEmailAddress = () => {
    if (!inputValue) return;
    if (!uurl.isValidEmail(inputValue)) {
      return setError('Please enter a valid email.');
    }
    return setError('Please enter a valid email.');
  };

  const addNew = (newEmails) => {
    
  };

  return (
    <CTFragment className="email-list-container">
      <CTForm
        id="email-list" 
        padding={[10, 35]}
        heading="ADD XXX" 
        details="Add XXX"
        onSave={() => 1}
        onCancel={() => 1}
      >     
        <CTFormRow>
          <CTFragment className="email-list-left">
            <UploadButton addNew={addNew} />
          </CTFragment>

          <CTFragment className="email-list-right">
            <CTInput
              underlined
              id="email-address"
              label="Filter/Add emails ..."
              color="grey"
              type="email"
              placeholder="Enter email here..."
              value={inputValue}
              onChange={handleInputChange}
            />
            <CTFragment hCenter padding={[20, 0, 0, 0]} className="email-list-add-btn">
              <Button
                uppercase
                compact
                text="Add"
                color="teal transparent"
                onClick={addEmailAddress}
              />
            </CTFragment>
          </CTFragment>
        </CTFormRow>
      </CTForm>
    </CTFragment>
  );
}

export const EmailList = EmailListWithRedux;