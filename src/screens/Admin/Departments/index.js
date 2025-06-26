/**
 * Pane for Courses of Admin Page
 */

import React, { useContext } from 'react';
// UI
import { Tab, Divider, Message, Form, Select } from 'semantic-ui-react';
import DepartmentEditing from './DepartmentEditing';
import { CreateNewButton, AdminListItem, GeneralAlert, AdminHeading } from '../Components';
import { AdminContext } from '..';

export default function DepartPane() {
  const { departments, universities, currentUni, getSelectOptions, updateUniversity } = useContext(AdminContext);

  const uniOptions = getSelectOptions(universities);
  const displayUni = currentUni || { name: 'none', id: 0 };

  return (
    <Tab.Pane attached={false} className="ap-list">
      <AdminHeading name="Departments" />
      <Message color="black">
        {/* <p>
          <strong>{displayUni.name}</strong>
        </p> */}
        <Form>
          <Form.Field
            control={Select}
            options={uniOptions}
            label='Select University'
            id='admin-depart-select-uni'
            placeholder='University...'
            onChange={(e, data) => updateUniversity(data.value)}
          />
        </Form>
      </Message>

      {displayUni.id === 0 ? (
        <GeneralAlert type="selectUni" open fixed />
      ) : (
        <>
          <CreateNewButton name="Create New Department" path="departments" id={displayUni.id} />
          <Divider horizontal>All Departments</Divider>
          {(departments || [])
            .slice()
            .reverse()
            .map((depart) => (
              <AdminListItem
                header={depart.name}
                path="departments"
                id={depart.id}
                key={depart.id}
                items={[`Acronym: ${depart.acronym}`, displayUni.name]}
              />
            ))}
        </>
      )}
    </Tab.Pane>
  );
}
