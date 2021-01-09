import React, { useEffect, useState } from 'react';
import { useArray } from 'hooks';
import { CTFragment, CTForm, CTFormRow } from 'layout';
import EmailFilter from './EmailFilter';
import UploadFile from './UploadFile';
import './index.scss';

export function EmailList(props) {
  let { defaultEmails, title, description, onSave } = props;
  const emails = useArray(defaultEmails);
  const [lastEmails, setLastEmails] = useState(defaultEmails);
  const canUpdate = JSON.stringify(emails.value) !== JSON.stringify(lastEmails);

  useEffect(() => {
    setLastEmails(defaultEmails);
    emails.setValue(defaultEmails);
  }, [defaultEmails]);

  const handleSave = () => {
    if (typeof onSave === 'function') {
      onSave({
        addedEmails: emails.includesMore(defaultEmails),
        removedEmails: emails.includesLess(defaultEmails)
      });

      setLastEmails(emails.value);
    }
  };

  return (
    <CTForm
      collapsible
      id="email-list" 
      padding={[10, 35]}
      heading={title}
      details={description}
      onSave={canUpdate ? handleSave : null}
      onSaveButtonText="Update Emails"
      className="email-list-container"
    >     
      <CTFormRow>
        <CTFragment className="email-list-left">
          <UploadFile emails={emails} onSave={handleSave} />
        </CTFragment>

        <CTFragment className="email-list-right">
          <EmailFilter emails={emails} onSave={handleSave} />
        </CTFragment>
      </CTFormRow>
    </CTForm>
  );
}