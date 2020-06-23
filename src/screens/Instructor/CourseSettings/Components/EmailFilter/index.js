import React from 'react';
import {
  CTFragment,
  CTInput
} from 'layout';
import { user, uemail } from 'utils';
import { Button } from 'pico-ui';
import _ from 'lodash';

export function EmailFilter(props) {
  const {
    emails,
    setEmails,
    inputValue,
    setInputValue,
    error,
    setError
  } = props;

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

  return (
    <CTFragment>
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
  );
}