/**
 * Pane for Terms of Admin Page
 */

import React from 'react';
import { Route } from 'dva/router';
// UI
import { Tab, Divider, Message, Form, Select } from 'semantic-ui-react';
import TermEditing from './TermEditing';
import { CreateNewButton, AdminListItem, GeneralAlert, AdminHeading } from '../Components';

export default function TermPane(props) {
  const { terms, universities, termCurrUni } = props.state;
  const uniOptions = props.getSelectOptions(universities);
  const currUni = termCurrUni || { name: 'none', id: 0 };

  return (
    <Tab.Pane attached={false} className="ap-list">
      <AdminHeading name="Terms" />
      
      <Route path="/admin/terms/:type?=:id" component={TermEditing} />
      <Message color="black">
        <Message.Header>Select from Universities</Message.Header>
        <p>
          Current University: <strong>{currUni.name}</strong>
        </p>
        <Form>
          <Form.Field
            control={Select}
            options={uniOptions}
            defaultValue={localStorage.getItem('termCurrUni')}
            onChange={(event, data) => props.setCurrent('termCurrUni', data)}
          />
        </Form>
      </Message>

      {currUni.id === 0 ? (
        <GeneralAlert type="selectUni" open fixed />
      ) : (
        <>
          <CreateNewButton name="Create New Terms" path="terms" id={currUni.id} />

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
