/* Todo: set eslint config to parse label check correctly */
/* eslint-disable jsx-a11y/label-has-associated-control */
/**
 * Pane for Courses of Admin Page
 */

import React, { useContext } from 'react';
// UI
import { Tab, Divider, Message, Form, Select } from 'semantic-ui-react';
import { CreateNewButton, AdminListItem, GeneralAlert, AdminHeading } from '../Components';
import { AdminContext } from '..';

export default function CoursePane() {
  const { universities, currentUni, currentDept, departments, courses, getSelectOptions, updateDepartment, updateUniversity } = useContext(AdminContext);

  const displayUni = currentUni || { name: 'none', id: 0 };
  const displayDepart = currentDept || { name: 'none', id: 0 };

  const uniOptions = getSelectOptions(universities);
  const departOptions = getSelectOptions(departments);

  return (
    <Tab.Pane attached={false} className="ap-list">
      <AdminHeading name="Course Templates" />
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
            onChange={(e, data) => updateUniversity(data.value)}
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
                onChange={(e, data) => updateDepartment(data.value)}
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
