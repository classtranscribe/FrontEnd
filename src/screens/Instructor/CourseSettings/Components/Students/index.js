import React from 'react';
import { EmailList } from '../EmailList';

function StudentsWithRedux() {
    return (
      <EmailList
        title="Students"
        description="Add students"
        defaultEmails={[]}
      />
    );
}

export const Students = StudentsWithRedux;