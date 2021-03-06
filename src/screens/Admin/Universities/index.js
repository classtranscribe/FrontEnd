/**
 * Pane for Universities of Admin Page
 */

import React from 'react';
import { Route } from 'dva/router';
// UI
import { Tab, Divider } from 'semantic-ui-react';
import UniversityEditing from './UniversityEditing';
import { CreateNewButton, AdminListItem, AdminHeading } from '../Components';

export default function UniPane({ state: { universities } }) {
  return (
    <Tab.Pane attached={false} className="ap-list">
      <Route path="/admin/universities/:type?=:id" component={UniversityEditing} />
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
