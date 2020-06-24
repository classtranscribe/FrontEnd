import React from 'react';
import PropTypes from 'prop-types';
import {
  CTFragment,
  CTInput,  
  CTFilter
} from 'layout';
import { user, uemail } from 'utils';
import { Button } from 'pico-ui';
import _ from 'lodash';

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
  };
  const demailFilter = (result) => {
    let x = null;
    if (result.length === 0) {
      x = (
        <div className="no-email">
          <span>You have not add this email before.</span>
        </div>
      );
    } else {
      // not work
      x = result.map(email => <myEmailId email={emails} />)// how to check the email in the emails
    }
    return (
      // what's this means
      <CTFragment list role="list">
        {x}
      </CTFragment>
    );
  }

  return (
    // what's hCenter means
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
      <CTFilter
        withDefaultFilter
        data={emails}
      >
        {demailFilter}
      </CTFilter>
      <CTFragment hCenter padding={[20, 0, 0, 0]} className="email-list-add-btn">
        <Button
          uppercase
          compact
          text="Add"
          color="teal transparent"
          onClick={addEmailAddress}
        />
      </CTFragment>
      {/* set the filter return ???????????????? */}
      {/* <CTFragment>
        <CTFilter
          withDefaultFilter
          data={emails}
        >
          {demailFilter}
        </CTFilter>
      </CTFragment> */}
      {/* ??????????????????????????????????????? */}
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

EmailFilter.propTypes = {
  emails: PropTypes.array,
  setEmails: PropTypes.func,
  inputValue: PropTypes.string,
  setInputValue: PropTypes.func,
  error: PropTypes.array,
  setError: PropTypes.func
};

export default EmailFilter;