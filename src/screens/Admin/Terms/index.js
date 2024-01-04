/**
 * Pane for Terms of Admin Page
 */

import React from 'react';
import { Route } from 'dva/router';
// UI
import { Tab, Divider, Message, Form, Select, Label } from 'semantic-ui-react';
import TermEditing from './TermEditing';
import { CreateNewButton, AdminListItem, GeneralAlert, AdminHeading } from '../Components';



export default function TermPane(props) {
  const { terms, universities, currentUni } = props.state;
  const uniOptions = props.getSelectOptions(universities);
  const displayUni = currentUni || { name: 'none', id: 0 };
  
  return (
    <Tab.Pane attached={false} className="ap-list">
      <AdminHeading name="Terms" />
      
      <Route path="/admin/terms/:type?=:id" component={TermEditing} />
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
            onChange={(e,data)=>props.updateUniversity(data.value)}
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
