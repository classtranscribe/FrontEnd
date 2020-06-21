import React, {useState} from 'react';
import {
  CTFragment,
  CTForm, 
  CTFormRow, 
  CTInput,
  CTFormHelp
} from 'layout';
import { Button } from 'pico-ui';
import _ from 'lodash';
import { user, uurl } from 'utils';
import { UploadButton } from '../UploadButton'
import './index.scss';

// add a function which is not work before.
function validateEmail(email) {
  const re = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i;
  return re.test(String(email).toLowerCase());
}
//
function EmailListWithRedux(props) {
  let { title, description, onSave } = props;
  const [emails, setEmails] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);

  const myEmailId = user.getUserInfo({ allowLoginAsOverride: true }).emailId;

  const handleInputChange = ({ target: { value }}) => setInputValue(value);

  const addEmailAddress = () => {
    if (!inputValue) return;
    // has an error in this place.
    // if (!uurl.isValidEmail(inputValue)) {
      // return setError('Please enter a valid email.');
    // }
    if (!validateEmail(inputValue)) {
      return setError('Please enter a valid email.');
    }
    // return setError('Please enter a valid email.');
    let includes = _.includes(emails, inputValue);
    includes = includes || inputValue === myEmailId;
    if (!includes) {
      let newEmails = [...emails, inputValue];
      setEmails(newEmails);
      setInputValue('');
      if (error) setError(null);
    }
  };

  const addNew = (newEmails) => {
    newEmails = _.filter(newEmails, (email) => {
      if (!email || !uurl.isValidEmail(email)) {
        return false;
      }
      if (_.includes(emails, email) || email === myEmailId) {
        return false;
      }
      return true;
    });
    setEmails([...emails, ...newEmails]);
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