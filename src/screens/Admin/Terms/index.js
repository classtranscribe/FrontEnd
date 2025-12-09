/**
 * Pane for Terms of Admin Page
 */

import React, { useContext } from 'react';
import { Tab, Divider, Message, Form, Select } from 'semantic-ui-react';
import { CreateNewButton, AdminListItem, GeneralAlert, AdminHeading } from '../Components';
import { AdminContext } from '..';


export default function TermPane() {
  const { terms, universities, currentUni, getSelectOptions, updateUniversity } = useContext(AdminContext);
  const uniOptions = getSelectOptions(universities);
  const displayUni = currentUni || { name: 'none', id: 0 };

  return (
    <Tab.Pane attached={false} className="ap-list">
      <AdminHeading name="Terms" />
      <Message color="black">
        {/* <p>
          <strong>{displayUni.name}</strong>
        </p> */}
        <Form>
          <Form.Field
            id='admin-terms-select-uni'
            label='University'
            control={Select}
            options={uniOptions}
            onChange={(e, data) => updateUniversity(data.value)}
          />
        </Form>
      </Message>

      {displayUni.id === 0 ? (
        <GeneralAlert type="selectUni" open fixed />
      ) : (
        <>
          <CreateNewButton name="Create New Terms" path="terms" id={displayUni.id} />

          <Divider horizontal>All Terms</Divider>
          {(terms || [])
            .slice()
            .reverse()
            .map((term) => (
              <AdminListItem
                header={term.name}
                path="terms"
                id={term.id}
                key={term.id}
                items={[`Start Date: ${term.startDate}`, `End Date: ${term.endDate}`]}
              />
            ))}
        </>
      )}
    </Tab.Pane>
  );
}
