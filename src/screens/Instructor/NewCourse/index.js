import React, { Component } from 'react'
import { CTLayout, CTFormHeading, CTForm, CTFormHelp, CTFormRow, CTInput, CTCheckbox } from 'layout'
import { api } from 'utils';

export class NewCourse extends Component {
  componentDidMount() {
    api.contentLoaded();
  }

  render() {
    const layoutProps = CTLayout.createProps({
      transition: true,
      responsive: true,
      footer: true,
      headingProps: {
        heading: 'Create a New Course',
        icon: 'add',
        sticky: true,
        gradient: true,
        offsetTop: 30
      }
    });

    return (
      <CTLayout {...layoutProps}>
        <CTForm
          expanded
          collapsible
          padding={[0, 35]} 
          id="new-course" 
          heading="Basic Info" 
          onSave={() => 1}
          onCancel={() => 1}
        >
          <CTFormHeading>Section 1</CTFormHeading>

          <CTFormRow>
            <CTInput
              required
              id="course-number"
              label="Course Number"
              placeholder="Course Number"
            />

            <CTInput
              error
              id="course-name"
              defaultValue="System Programming"
              label="Course Name"
              helpText="This is the course name"
            />
          </CTFormRow>

          <CTFormRow>
            <CTInput 
              textarea
              id="course-description"
              defaultValue={`The description for System Programming \nCan have multiples`}
              label="A Textarea Example"
            />
          </CTFormRow>

          <CTFormHeading>Section 2</CTFormHeading>

          <CTFormHelp title="Help">
            You can write a instruction here
          </CTFormHelp>

          <CTFormRow padding={[0, 10]}>
            <CTInput
              required
              underlined
              id="course-number-2"
              label="Underlined Input"
              placeholder="Underlined Input"
            />

            <CTInput
              error
              underlined
              id="course-name-2"
              defaultValue="System Programming"
              label="Course Name"
              helpText="The input can be underlined"
            />
          </CTFormRow>

          <CTFormRow padding={[0, 10]}>
            <CTCheckbox 
              id="log-event"
              legend="An checkbox example"
              label="Log student events"
            />
          </CTFormRow>

          <CTFormRow padding={[0, 10]}>
            <CTCheckbox 
              checked 
              error
              id="log-event-error"
              legend="An checkbox example with error"
              label="Log student events"
              helpText="An error occurs"
            />
          </CTFormRow>
        </CTForm>
      </CTLayout>
    )
  }
}
