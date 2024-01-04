/* Todo: set eslint config to parse label check correctly */
/* eslint-disable jsx-a11y/label-has-associated-control */
/**
 * Pane for Courses of Admin Page
 */

import React from 'react';
import { Route } from 'dva/router';
// UI
import { Tab, Divider, Message, Form, Select } from 'semantic-ui-react';
import CourseEditing from './CourseEditing';
import { CreateNewButton, AdminListItem, GeneralAlert, AdminHeading } from '../Components';

export default function CoursePane(props) {
  const { universities, currentUni, currentDept, departments, courses } = props.state;

  const displayUni = currentUni || { name: 'none', id: 0 };
  const displayDepart = currentDept || { name: 'none', id: 0 };

  const uniOptions = props.getSelectOptions(universities);
  const departOptions = props.getSelectOptions(departments);

  return (
    <Tab.Pane attached={false} className="ap-list">
      <AdminHeading name="Course Templates" />
      <Route path="/admin/course-template/:type?=:id" component={CourseEditing} />

      <Message color="black">
        {/* <p>
          <strong>{displayUni.name}</strong>
        </p> */}
        <Form>
          <Form.Field
            control={Select}
            options={uniOptions}
            id='admin-course-uni-select'
            label='University'
            placeholder='University...'
            onChange={(e,data)=>props.updateUniversity(data.value)}
          />
        </Form>
        {displayUni.id !== 0 && (
          <>
           
            {/* <p>
              <strong>{displayDepart.name}</strong>
            </p> */}
            <Form>
              <Form.Field
                search
                id='admin-course-depart-select'
                label='Department'
                placeholder='Department...'
                control={Select}
                options={departOptions}
                onChange={(e, data) => props.updateDepartment(data.value)}
              />
            </Form>
          </>
        )}
      </Message>
      {displayUni.id === 0 ? (
        <GeneralAlert type="selectUni" open fixed />
      ) : displayDepart.id === 0 ? (
        <GeneralAlert type="selectDepart" open fixed />
      ) : (
        <>
          <CreateNewButton name="Create New Course" path="course-template" id={displayDepart.id} />

          <Divider horizontal>All Courses</Divider>
          {(courses || [])
            .slice()
            .reverse()
            .map((course) => (
              <AdminListItem
                header={`${displayDepart.acronym}${course.courseNumber}`}
                path="course-template"
                id={course.id}
                key={course.id}
              />
            ))}
        </>
      )}
    </Tab.Pane>
  );
}
