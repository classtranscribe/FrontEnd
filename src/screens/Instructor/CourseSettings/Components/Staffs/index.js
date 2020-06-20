import React from 'react';
import { EmailList } from '../EmailList';

function StaffsWithRedux() {
    return (
      <EmailList
        title="Staffs"
        description="Add staffs"
      />
    );
}

export const Staffs = StaffsWithRedux;