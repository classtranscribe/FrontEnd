import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { CTFragment, CTFilter, CTInput, CTText } from 'layout';
import { user, uemail } from 'utils';
import { Button } from 'pico-ui';
import IconButton from '@material-ui/core/Button'
import {Delete} from '@material-ui/icons';
import EmailItem from './EmailItem';

function EmailFilter(props) {
  const {
    emails,
    setEmails,
    inputValue,
    setInputValue,
    error,
    setError
  } = props;

  const myEmailId = user.getUserInfo({ allowLoginAsOverride: true }).emailId;

  const handleInputChange = ({ target: { value }}) => {
    setInputValue(value);
    if (error && uemail.isValid(inputValue)) {
      setError(null);
    }
  };

  // move the email
  const removeEmailAddress = () => {
    _.remove(emails, (e) => e === inputValue);
    setEmails([...emails]);
  };

  const addEmailAddress = () => {
    if (!inputValue) return;
    if (!uemail.isValid(inputValue)) {
      return setError('Please enter a valid email.');
    }

    let includes = inputValue === myEmailId || _.includes(emails, inputValue);
    if (!includes) {
      const newEmails = [...emails, inputValue];
      setEmails(newEmails);
      setInputValue('');
      if (error) setError(null);
    }
  };

  const emailResult = (result) => {
    let emailListElement = null;
    if (result.length === 0) {
      emailListElement = (
        <CTFragment list>
          <CTText margin={[10, 0]} center muted>No result</CTText>
          <CTFragment hCenter>
            <Button
              uppercase
              compact
              text="Add this email"
              color="teal"
              onClick={addEmailAddress}
            />
          </CTFragment>
        </CTFragment>
      );
    } else {
      if (result.length === emails.length) {
        result = [`${myEmailId} (You)`, ...result];
      }
      emailListElement = result.map(email => (
        <EmailItem email={email} removeEmailAddress={removeEmailAddress} />
      ));
    }

    return (
      <CTFragment list role="list" padding={[20, 0, 0, 0]}>
        {emailListElement}
        <IconButton>
          <Delete
            onClick={removeEmailAddress}
          />
        </IconButton> 
      </CTFragment>
    );
  }

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
        error={error}
        helpText={error}
      />
      <CTFilter
        value={inputValue}
        data={emails}
      >
        {emailResult}
      </CTFilter>
    </CTFragment>
  );
}

EmailFilter.propTypes = {
  emails: PropTypes.array,
  setEmails: PropTypes.func,
  inputValue: PropTypes.string,
  setInputValue: PropTypes.func,
  error: PropTypes.array,
  setError: PropTypes.func
};

export default EmailFilter;
