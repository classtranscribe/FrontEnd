import React, { useState, useEffect } from 'react';
import { useArray } from 'hooks';
import PropTypes from 'prop-types';
import { Button } from 'pico-ui';
import { CTFragment, CTFilter, CTInput, CTText } from 'layout';
import { /** user, */ uemail } from 'utils';
import { SelectCtrlButton } from 'components';
import EmailItem from './EmailItem';

function EmailFilter(props) {
  const { emails } = props;
  // const myEmailId = user.getUserInfo({ allowLoginAsOverride: true }).emailId;

  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);
  const selectedEmails = useArray([]);
  const selecting = !selectedEmails.isEmpty;

  // add/remove emails to the selected emails
  const handleSelectEmail = (email, select) => {
    if (select) {
      selectedEmails.push(email);
    } else {
      selectedEmails.removeExact(email);
    }
  };

  // remove all selected emails 
  const removeSelectedEmails = () => {
    setInputValue('');
    emails.removeItems(selectedEmails);
  };

  // returns if an email is in the selected emails
  const isSelected = selectedEmails.includes;

  const handleInputChange = ({ target: { value }}) => {
    setInputValue(value);
    if (error && (uemail.isValid(value) || !value)) {
      setError(null);
    }
  };

  // remove the email
  const handleRemoveEmail = (email) => {
    emails.removeExact(email);
  };

  // add an email from the input
  const handleAddEmail = () => {
    if (!inputValue) return;
    if (!uemail.isValid(inputValue)) {
      return setError('Please enter a valid email.');
    }

    if (!emails.includes(inputValue)) {
      emails.pushStart(inputValue);
      setInputValue('');
      if (error) setError(null);
    }
  };

  useEffect(() => {
    // remove non-exist emails in the selected emails when emails changed
    selectedEmails.remove(email => !emails.includes(email));
  }, [emails]);

  const emailResult = (result) => {
    let emailListElement = null;
    // if the result is empty and no email input
    if (result.length === 0 && !inputValue) {
      emailListElement = (
        <CTFragment dFlexCol>
          <CTText margin={[10, 0]} center muted>No Emails</CTText>
        </CTFragment>
      );
    // if the result is empty and ready to add an input email
    } else if (result.length === 0) {
      emailListElement = (
        <CTFragment dFlexCol>
          <CTText margin={[10, 0]} center muted>No result</CTText>
          <CTFragment justConCenter>
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
      selectAll: () => selectedEmails.setValue(result),
      removeAll: selectedEmails.clear,
      isSelectedAll: result.length === selectedEmails.length
    };

    return (
      <>
        <CTFragment className="cs-email-filter-ol" role="list" data-scroll>
          {emailListElement}
        </CTFragment>
        <CTFragment padding={[10, 0]} alignItCenter className="cs-email-filter-actions">
          <SelectCtrlButton {...selectBtnProps} />
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
        data={emails.value}
        regexFlags="i"
      >
        {emailResult}
      </CTFilter>
    </CTFragment>
  );
}

EmailFilter.propTypes = {
  emails: PropTypes.any,
};

export default EmailFilter;
