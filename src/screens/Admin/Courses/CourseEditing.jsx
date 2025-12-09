/**
 * Editing Page for Courses (Functional Version)
 */

import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Form, Input } from 'semantic-ui-react';
import { api, links } from 'utils';
import { updateJson } from '../helpers';

import { SubmitButton, EditButtons, GeneralModal, GeneralLoader } from '../Components';

const { initialCourse } = api.initialData;

export default function CourseEditing() {
  const { id, type } = useParams();
  const navigate = useNavigate();

  const isNew = type === 'new';

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(_.clone(initialCourse));
  const [courseInfo, setCourseInfo] = useState(_.clone(initialCourse));
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      api.getCourseById(id).then(({ data }) => {
        setCourse(data);
        setCourseInfo(_.clone(data));
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [id, isNew]);

  const onChange = (value, key) => {
    setCourseInfo((prev) => ({ ...prev, [key]: value }));
  };

  const onSave = () => {
    window.location = links.admin('course-template'); // or navigate('/admin/course-template')
  };

  const onSubmit = () => {
    const data = { ...courseInfo, departmentId: id };
    api.createCourse(data).then(() => onSave());
  };

  const onUpdate = () => {
    const data = updateJson(courseInfo, course);
    data.id = id;
    api.updateCourse(data).then(() => onSave());
  };

  const onConfirm = () => setConfirmed(true);

  const onInactive = () => {
    api.deleteCourse(id).then(() => onSave());
  };

  const onCancel = () => {
    navigate(-1);
  };

  const header = isNew ? 'Create New Course' : 'Edit the Course';
  const button = isNew
    ? <SubmitButton onSubmit={onSubmit} onCancel={onCancel} />
    : <EditButtons onUpdate={onUpdate} onCancel={onCancel} onInactive={onInactive} onConfirm={onConfirm} confirmed={confirmed} />;

  return (
    <GeneralModal header={header} open onClose={onCancel} button={button}>
      <CourseForm isNew={isNew} course={course} loading={loading} onChange={onChange} />
    </GeneralModal>
  );
}

function CourseForm({ isNew, course, loading, onChange }) {
  const effectiveCourse = isNew ? _.clone(initialCourse) : course;

  return (
    <Form className="ap-form">
      {!loading || isNew ? (
        <Grid columns="equal" verticalAlign="middle">
          <Grid.Row>
            <Grid.Column>
              <Form.Field
                fluid
                id="course-num-edit"
                control={Input}
                label="Course Number"
                placeholder="E.g. 241"
                defaultValue={effectiveCourse.courseNumber}
                onChange={({ target: { value } }) => onChange(value, 'courseNumber')}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      ) : (
        <GeneralLoader inverted height="10rem" />
      )}
    </Form>
  );
}
