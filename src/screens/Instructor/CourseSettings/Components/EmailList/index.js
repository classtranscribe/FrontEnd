import React, { useEffect } from 'react';
import { useArray } from 'hooks';
import { CTFragment, CTForm, CTFormRow } from 'layout';
import EmailFilter from './EmailFilter';
import UploadFile from './UploadFile';
import './index.scss';

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
    <CTForm
      collapsible
      id="email-list" 
      padding={[10, 35]}
      heading={title}
      details={description}
      onSave={handleSave}
      onSaveButtonText="Update Emails"
      className="email-list-container"
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
  );
}