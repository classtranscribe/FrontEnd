/**
 * Editing Page for Courses
 */

import React from 'react'
// UI
import { SubmitButton, EditButtons, GeneralModal, GeneralLoader } from '../Components'
import { Grid, Form, Input, TextArea } from 'semantic-ui-react'
// Vars
import { api, handleData, util } from '../../../util'
const { initialCourse } = api.initialData

export default class CourseEditing extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.match.params.id,
      isNew: this.props.match.params.type === 'new',
      loading: true,

      course: handleData.copy(initialCourse),
      courseInfo: handleData.copy(initialCourse),
      confirmed: false,
    }
    this.path = 'Courses'
  }

  componentDidMount() {
    const { isNew, id } = this.state
    if (!isNew) {
      api.getData(this.path, id)
        .then( response => this.setState({course: response.data, loading: false}))
    }
  }

  onChange = (value, key) => {
    const { courseInfo } = this.state
    courseInfo[key] = value
    this.setState({ courseInfo })
  }

  onSubmit = () => {
    const { courseInfo, id } = this.state
    courseInfo.departmentId = id
    api.postData(this.path, courseInfo, () => this.onSave())
  }

  onUpdate = () => {
    const { course, courseInfo, id } = this.state
    var data = handleData.updateJson(courseInfo, course)
    data.id = id
    api.updateData(this.path, data, () => this.onSave())
  }

  onConfirm = () => this.setState({confirmed: true})

  onInactive = () => {
    api.deleteData(this.path, this.state.id, () => this.onSave())
  }

  onSave = () => {
    util.toAdminPage()
  }

  onCancel = () => {
    this.props.history.goBack()
  }

  render() {
    const { isNew } = this.state
    const header = isNew ? 'Create New Course' : 'Edit the Course'
    const button = isNew ? <SubmitButton {...this}/>
                         : <EditButtons {...this} />
    return(
      <GeneralModal 
        header={header}
        open={true} 
        onClose={this.onCancel}
        button={button}
      >
        <CourseForm {...this}/>
      </GeneralModal>
    )
  }
}

function CourseForm({ state: {isNew, course, loading}, onChange}) {
  if (isNew) course = handleData.copy(initialCourse)
  return (
    <Form className="ap-form">
      {loading ? 
      <Grid columns='equal' verticalAlign="middle">
        <Grid.Row >
          <Grid.Column>
            <Form.Field
              fluid
              id='course-num-edit'
              control={Input}
              label='Course Number'
              placeholder='E.g. 241'
              defaultValue={course.courseNumber}
              onChange={({target: {value}}) => onChange(value, 'courseNumber')}
            />
          </Grid.Column>
          <Grid.Column>
            <Form.Field
              fluid
              id='course-name-edit'
              control={Input}
              label='Course Name'
              placeholder='E.g. System Programming'
              defaultValue={course.courseName}
              onChange={({target: {value}}) => onChange(value, 'courseName')}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Form.Field
              id='course-decription-edit'
              control={TextArea}
              label='Course Description'
              placeholder='Enter course description here ...'
              defaultValue={course.description}
              onChange={({target: {value}}) => onChange(value, 'description')}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid> : <GeneralLoader inverted height='10rem'/>}
    </Form>
  )
}