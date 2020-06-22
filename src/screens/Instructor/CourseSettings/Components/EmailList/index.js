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
import { user, uurl , uemail } from 'utils';
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
    if (!uemail.isValid(inputValue)) {
      return setError('Please enter a valid email.');
    }
    let includes = _.includes(emails, inputValue);
    includes = includes || inputValue === myEmailId;
    if (!includes) {
      let newEmails = [...emails, inputValue];
      setEmails(newEmails);
      setInputValue('');
      if (error) setError(null);
    }
    // if (!uemail.isValid(newEmail)) {
    //   return false;
    // } else if (_.includes(emails, newEmail) || newEmail === myEmailId) {
    //   return false;
    // } else {
    //   setEmails([...emails, ...newEmail]);
    // }
    // .......................................
    // if (!_.includes(emails, inputValue)) {
    //   setEmails([...emails, ...inputValue]);
    //   setInputValue('');
    //   if (error) {
    //     setError(null);
    //   }
    // }
    // has an error in this place.
    // if (!uurl.isValidEmail(inputValue)) {
      // return setError('Please enter a valid email.');
    // }
    // return setError('Please enter a valid email.');
  };

  const handleFileUpload = (files) => {
    if (files.length > 0) {
      // console.log(files)
      // console.log(files.length)
      for (let i = 0; i < files.length; i += 1) {
        const reader = new FileReader()
        reader.onload = async (e) => { 
          const text = (e.target.result)
          // console.log(text)
        };
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
            {/* email list */}
            <CTFragment className="email-list" role="list">
              {
                <div className="ip-f-email-item">
                  {myEmailId}
                  <i>(You)</i>
                </div>
              }
              {(emails || [])
                  .slice()
                  .reverse()
                  .map((email) => (
                    <div className="ip-f-email-item" key={email}>
                      {email}
                      {/* <Icon
                        name="trash"
                        onClick={() => removeStaff(email)}
                        title="remove"
                        aria-label="remove"
                        role="button"
                      /> */}
                    </div>
                  ))}
            </CTFragment>
            
          </CTFragment>
        </CTFormRow>
      </CTForm>
    </CTFragment>
  );
}

export const EmailList = EmailListWithRedux;