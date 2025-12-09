/**
 * Pane for Universities of Admin Page
 */

import React, { useContext } from 'react';
import { Tab, Divider } from 'semantic-ui-react';
import { CreateNewButton, AdminListItem, AdminHeading } from '../Components';
import { AdminContext } from '..';

export default function UniPane() {
  const { universities } = useContext(AdminContext);
  return (
    <Tab.Pane attached={false} className="ap-list">
      <AdminHeading name="Universities" />
      <CreateNewButton name="Create New University" id="new" path="universities" />

      <Divider horizontal>All Universities</Divider>
      {(universities || [])
        .slice()
        .reverse()
        .map((university) => (
          <AdminListItem
            header={university.name}
            path="universities"
            id={university.id}
            key={university.id}
            items={[`Domain: ${university.domain}`]}
          />
        ))}
    </Tab.Pane>
  );
}
