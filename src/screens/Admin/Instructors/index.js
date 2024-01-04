/**
 * Pane for Instructors of Admin Page
 */

import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Route } from 'dva/router';
import { Tab, Divider, Message, Form, Select } from 'semantic-ui-react';
import { api, prompt } from '../../../utils';
// UI
import InstructorEditing from './InstructorEditing';
import InstructorList from './InstructorList';
import { CreateNewButton, GeneralAlert, AdminHeading } from '../Components';

export default function InstructorPane(props) {
  const { state: { universities}, getSelectOptions } = props;
  const [instructors, setInstructors] = useState([]); // 'unset'
  const [loading, setLoading] = useState(true);
  const [uniOptions, setUniOptions] = useState([]);
  const [currUni, setCurrUni] = useState({ name: 'none', id: 0 });

  const onUniSelect = async ({ value }) => {
    setLoading(true);
    setCurrUni(() => _.find(universities, { id: value }));
    const roles = (await api.getRolesByUniId(value)).data
    setInstructors(() => roles);
    localStorage.setItem('adminCurrUni', value);
    setLoading(false);
  };

  useEffect(() => {
    if (universities.length) {
      setUniOptions(() => getSelectOptions(universities));
      const uniId = localStorage.getItem('adminCurrUni');
      if (uniId) onUniSelect({ value: uniId });
    }
  }, [universities, getSelectOptions]);

  const onInactive = (mailId) => {
    api
      .deleteRole(mailId)
      .then(() => {
        onUniSelect({ value: currUni.id });
        prompt.addOne({ text: `Removed instructor ${mailId}`, timeout: 3000 });
      })
      .catch(() => {
        prompt.error('Failed to delete the instructor.');
      });
  };

  return (
    <Tab.Pane attached={false} className="ap-list" loading={false}>
      <AdminHeading name="Instructors" />

      <Route path="/admin/instructors/:type?=:id" component={InstructorEditing} />

      <Message color="black">
        <p>
          University: <strong>{currUni.name}</strong>
        </p>
        <Form>
          <Form.Field
            control={Select}
            label="University"
            placeholder="University..."
            id='admin-instructor-select-uni'
            options={uniOptions}
            defaultValue={localStorage.getItem('adminCurrUni')}
            onChange={(event, data) => onUniSelect(data)}
          />
        </Form>
      </Message>

      {currUni.id === 0 ? (
        <GeneralAlert type="selectUni" open fixed />
      ) : (
        <>
          <CreateNewButton name="Add New Instructor" path="instructors" id={currUni.id} />
          <Divider horizontal>All Instructors</Divider>
          <InstructorList
            loading={loading}
            currUni={currUni}
            onInactive={onInactive}
            instructors={instructors}
          />
        </>
      )}
    </Tab.Pane>
  );
}
