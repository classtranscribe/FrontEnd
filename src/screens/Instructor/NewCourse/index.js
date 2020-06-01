import React, { Component } from 'react'
import { 
  CTLayout, 
  CTForm, 
  CTFormHeading, 
  CTFormHelp,
  CTFormRow, 
  CTInput,
  CTSelect,
  CTCheckbox
} from 'layout';
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

    const alertValue = ({ target: { value }}) => alert(value);

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
          <CTFormHeading>Input & Textarea</CTFormHeading>

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

          <CTFormHeading>Instruction box</CTFormHeading>

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

          <CTFormHeading>Checkbox</CTFormHeading>

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

          <CTFormHeading>Selection</CTFormHeading>

          <CTFormRow>
            <CTSelect
              id="sel-1"
              label="Selection"
              defaultValue="opt-1"
              options={[
                {value: 'opt-1', text: 'Option 1'},
                {value: 'opt-2', text: 'Option 2'},
                {value: 'opt-3', text: 'Option 3', description: 'A description to option 3'},
                {value: 'opt-4', text: 'Option 4', description: 'A description to option 4'}
              ]}
              onChange={alertValue}
            />

            <CTSelect
              underlined
              error
              id="sel-2"
              label="Underlined Selection"
              defaultValue="opt-1"
              helpText="There is an error occurred"
              options={[
                {value: 'opt-1', text: 'Option 1'},
                {value: 'opt-2', text: 'Option 2'},
                {value: 'opt-3', text: 'Option 3', description: 'A description to option 3'},
                {value: 'opt-4', text: 'Option 4', description: 'A description to option 4'}
              ]}
              onChange={alertValue}
            />
          </CTFormRow>
        </CTForm>
      </CTLayout>
    )
  }
}
