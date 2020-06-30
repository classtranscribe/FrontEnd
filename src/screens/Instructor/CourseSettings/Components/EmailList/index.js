import React, { useEffect } from 'react';
import { useArray } from 'hooks';
import { CTFragment, CTForm, CTFormRow } from 'layout';
import EmailFilter from './EmailFilter';
import UploadFile from './UploadFile';
import './index.scss';

const sampleEmails = [
  'shawn@gmail.com',
  'david@illinois.edu',
  'alice@illinois.edu',
  'michael@gmail.com',
  'alice2@gmail.com',
  'michael1988@gmail.com',
  'david2020@illinois.edu',
  'shawn@illinois.cs.com',
  'alice.cs.2019@gmail.com',
  'alice.career.2019@gmail.com',
];

export function EmailList(props) {
  let { defaultEmails, title, description, onSave } = props;
  const emails = useArray(defaultEmails);

  useEffect(() => {
    emails.setValue(defaultEmails);
  }, [defaultEmails]);

  const handleSave = () => {
    if (typeof onSave === 'function') {
      onSave({
        addedEmails: emails.includesMore(defaultEmails),
        removedEmails: emails.includesLess(defaultEmails)
      });
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
        onSave={handleSave}
        onSaveButtonText="Update Emails"
      >     
        <CTFormRow>
          <CTFragment className="email-list-left">
            <UploadFile emails={emails} />
          </CTFragment>

          <CTFragment className="email-list-right">
            <EmailFilter emails={emails} />
          </CTFragment>
        </CTFormRow>
      </CTForm>
    </CTFragment>
  );
}