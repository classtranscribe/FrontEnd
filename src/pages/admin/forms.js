import React from 'react'
import { Form, Input, Select, TextArea } from 'semantic-ui-react'

export function TermForm(props) {
  return (
    <Form onSubmit={()=>props.onFormSubmit('term')}>
      <Form.Group widths='equal'>
        <Form.Field
          fluid
          id='term-name'
          control={Input}
          label='Term Name'
          placeholder='E.g. Spring 2019'
          value={props.state.term.name}
          onChange={event => props.onFormChange(event, 'term', 'name')}
        />
        <Form.Field
          fluid
          id='start-date'
          control={Input}
          label='Start Date'
          placeholder='E.g. 2199-06-23T18:38:05.281Z'
          value={props.state.term.startDate}
          onChange={event => props.onFormChange(event, 'term', 'startDate')}
        />
      </Form.Group>
      <Form.Button secondary>Submit</Form.Button>
    </Form>
  )
}

export function UniForm(props) {
  return (
    <Form onSubmit={()=>props.onFormSubmit('uni')}>
      <Form.Group widths='equal'>
        <Form.Field
          fluid
          id='uni-name'
          control={Input}
          label='University Name'
          placeholder='E.g. University of Illinois at Urbana Champaign'
          value={props.state.uni.name}
          onChange={event => props.onFormChange(event, 'uni', 'name')}
        />
        <Form.Field
          fluid
          id='uni-domain'
          control={Input}
          label='Domain'
          placeholder='E.g. ....'
          value={props.state.uni.domain}
          onChange={event => props.onFormChange(event, 'uni', 'domain')}
        />
      </Form.Group>
      <Form.Button secondary>Submit</Form.Button>
    </Form>
  )
}

export function DepartForm(props) {
  return (
    <Form onSubmit={()=>props.onFormSubmit('depart')}>
      <Form.Group widths='equal'>
        <Form.Field
          fluid
          id='depart-name'
          control={Input}
          label='Department Name'
          placeholder='E.g. Mathematics'
          value={props.state.depart.name}
          onChange={event => props.onFormChange(event, 'depart', 'name')}
        />
        <Form.Field
          fluid
          id='depart-acronym'
          control={Input}
          label='Acronym'
          placeholder='E.g. MATH'
          value={props.state.depart.acronym}
          onChange={event => props.onFormChange(event, 'depart', 'acronym')}
        />
      </Form.Group>
      <Form.Button secondary>Submit</Form.Button>
    </Form>
  )
}

export function CourseForm(props) {
  return (
    <Form onSubmit={()=>props.onFormSubmit('course')}>
      <Form.Group widths='equal'>
        <Form.Field
          fluid
          id='course-number'
          control={Input}
          label='Course Number'
          placeholder='E.g. 241'
          value={props.state.course.name}
          onChange={event => props.onFormChange(event, 'course', 'courseNumber')}
        />
        <Form.Field
          fluid
          id='course-name'
          control={Input}
          label='Course Name'
          placeholder='E.g. System Programming'
          value={props.state.course.acronym}
          onChange={event => props.onFormChange(event, 'course', 'courseName')}
        />
      </Form.Group>
      <Form.Field
        fluid
        id='course-decription'
        control={TextArea}
        label='Course Description'
        placeholder='Enter course description here ...'
        value={props.state.course.acronym}
        onChange={event => props.onFormChange(event, 'course', 'description')}
      />
      <Form.Button secondary>Submit</Form.Button>
    </Form>
  )
}

