/**
 * Editing Page for Courses
 */

import React from 'react';
import _ from 'lodash';
import { Grid, Form, Input } from 'semantic-ui-react';
import { api, links } from 'utils';
import { updateJson } from '../helpers';

import { SubmitButton, EditButtons, GeneralModal, GeneralLoader } from '../Components';

const { initialCourse } = api.initialData;

export default class CourseEditing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      isNew: this.props.match.params.type === 'new',
      loading: true,

      course: _.clone(initialCourse),
      courseInfo: _.clone(initialCourse),
      confirmed: false,
    };
  }

  componentDidMount() {
    const { isNew, id } = this.state;
    if (!isNew) {
      api.getCourseById(id).then(({ data }) => this.setState({ course: data, loading: false }));
    }
  }

  onChange = (value, key) => {
    const { courseInfo } = this.state;
    courseInfo[key] = value;
    this.setState({ courseInfo });
  };

  onSubmit = () => {
    const { courseInfo, id } = this.state;
    courseInfo.departmentId = id;
    api.createCourse(courseInfo).then(() => this.onSave());
  };

  onUpdate = () => {
    const { course, courseInfo, id } = this.state;
    let data = updateJson(courseInfo, course);
    data.id = id;
    api.updateCourse(data).then(() => this.onSave());
  };

  onConfirm = () => this.setState({ confirmed: true });

  onInactive = () => {
    api.deleteCourse(this.state.id).then(() => this.onSave());
  };

  onSave = () => {
    window.location = links.admin('course-template');
  };

  onCancel = () => {
    this.props.history.back();
  };

  render() {
    const { isNew } = this.state;
    const header = isNew ? 'Create New Course' : 'Edit the Course';
    const button = isNew ? <SubmitButton {...this} /> : <EditButtons {...this} />;

    return (
      <GeneralModal header={header} open onClose={this.onCancel} button={button}>
        <CourseForm {...this} />
      </GeneralModal>
    );
  }
}

function CourseForm({ state: { isNew, course, loading }, onChange }) {
  if (isNew) course = _.clone(initialCourse);
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
                defaultValue={course.courseNumber}
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
