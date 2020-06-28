import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CTFragment, CTFilter, CTInput, CTText } from 'layout';
import { user, uemail } from 'utils';
import { Button } from 'pico-ui';
import SelectionButton from 'screens/Instructor/InstPlaylist/components/MediaList/ActionBar/SelectionButton';
import EmailItem from './EmailItem';

function EmailFilter(props) {
  const {
    emails,
    setEmails
  } = props;
  const myEmailId = user.getUserInfo({ allowLoginAsOverride: true }).emailId;

  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const selecting = selectedEmails.length > 0;

  // add/remove emails to the selected emails
  const handleSelectEmail = (email, select) => {
    if (select) {
      setSelectedEmails([...selectedEmails, email]);
    } else {
      setSelectedEmails(_.filter(selectedEmails, selEmail => selEmail !== email));
    }
  };

  // remove all selected emails 
  const removeSelectedEmails = () => {
    setInputValue('');
    setEmails(_.filter(emails, email => !selectedEmails.includes(email)));
  };

  // returns if an email is in the selected emails
  const isSelected = (email) => _.includes(selectedEmails, email);

  const handleInputChange = ({ target: { value }}) => {
    setInputValue(value);
    if (error && (uemail.isValid(value) || !value)) {
      setError(null);
    }
  };

  // remove the email
  const handleRemoveEmail = (email) => {
    setEmails(_.filter(emails, em => em !== email));
  };

  // add an email from the input
  const handleAddEmail = () => {
    if (!inputValue) return;
    if (!uemail.isValid(inputValue)) {
      return setError('Please enter a valid email.');
    }

    let includes = inputValue === myEmailId || _.includes(emails, inputValue);
    if (!includes) {
      setEmails([inputValue, ...emails]);
      setInputValue('');
      if (error) setError(null);
    }
  };

  useEffect(() => {
    // remove non-exist emails in the selected emails when emails changed
    setSelectedEmails(_.filter(selectedEmails, email => emails.includes(email)));
  }, [emails]);

  const emailResult = (result) => {
    let emailListElement = null;
    // if the result is empty and no email input
    if (result.length === 0 && !inputValue) {
      emailListElement = (
        <CTFragment list>
          <CTText margin={[10, 0]} center muted>No Emails</CTText>
        </CTFragment>
      );
    // if the result is empty and ready to add an input email
    } else if (result.length === 0) {
      emailListElement = (
        <CTFragment list>
          <CTText margin={[10, 0]} center muted>No result</CTText>
          <CTFragment hCenter>
            <Button
              uppercase
              compact
              text="Add this email"
              color="teal"
              onClick={handleAddEmail}
            />
          </CTFragment>
        </CTFragment>
      );
    // if there are matched emails in the result
    } else {
      const emailLiProps = {
        isSelected,
        handleSelectEmail,
        handleRemoveEmail,
      };

      emailListElement = result.map(email => (
        <EmailItem email={email} {...emailLiProps} />
      ));
    }

    // props to the select handler button
    const selectBtnProps = {
      selecting,
      selectAll: () => setSelectedEmails(result),
      removeAll: () => setSelectedEmails([]),
      isSelectedAll: result.length === selectedEmails.length
    };

    return (
      <>
        <CTFragment className="cs-email-filter-ol" role="list" data-scroll>
          {emailListElement}
        </CTFragment>
        <CTFragment padding={[10, 0]} vCenter className="cs-email-filter-actions">
          <SelectionButton {...selectBtnProps} />
          <Button 
            uppercase 
            icon="delete" 
            disabled={!selecting}
            onClick={removeSelectedEmails}
          >
            Remove Selected Emails
          </Button>
        </CTFragment>
      </>
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
        onReturn={handleAddEmail}
        error={error}
        helpText={error}
      />
      <CTFilter
        value={inputValue}
        data={emails}
        regexFlags="i"
      >
        {emailResult}
      </CTFilter>
    </CTFragment>
  );
}

EmailFilter.propTypes = {
  emails: PropTypes.array,
  setEmails: PropTypes.func
};

export default EmailFilter;
