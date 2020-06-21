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
import { user, uurl } from 'utils';
import './index.scss';

function EmailListWithRedux(props) {
  let { title, description, onSave } = props;
  const [emails, setEmails] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);

  const myEmailId = user.getUserInfo({ allowLoginAsOverride: true }).emailId;

  const handleInputChange = ({ target: { value }}) => setInputValue(value);

  const addEmailAddress = () => {
    if (!inputValue) return;
    if (!uurl.isValidEmail(inputValue)) {
      return setError('Please enter a valid email.');
    }
    return setError('Please enter a valid email.');
  };

  const handleFileUpload = (files) => {
    if (files.length > 0) {
      alert(`Uploaded file ${files[0].name}`);
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