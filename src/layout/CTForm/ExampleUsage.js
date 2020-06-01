import React from 'react';
import {
  CTFragment,
  CTForm, 
  CTFormHeading, 
  CTFormHelp,
  CTFormRow, 
  CTInput,
  CTSelect,
  CTCheckbox,
  CTAutoComplete
} from 'layout';

/**
 * The basic usage of the CTForm and its components
 */
export function CTFormExampleUsage() {
  const alertValue = ({ target: { value }}) => alert(value);

  const exampleOptions = [
    {value: 'opt-1', text: 'Option 1'},
    {value: 'opt-2', text: 'Option 2'},
    {value: 'opt-3', text: 'Option 3', description: 'A description to option 3'},
    {value: 'opt-4', text: 'Option 4', description: 'A description to option 4'}
  ];

  return (
    <CTFragment>
      <CTForm
        collapsible
        padding={[10, 35]} 
        id="ctform-basics" 
        heading="Basic Usage" 
        details="Basic usage of the CTForm, includes CTInput, CTCheckbox and etc."
        onSave={() => 1}
        onCancel={() => 1}
      >
        {/* Input & Textarea */}
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

        {/* Instruction box */}
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


        {/* Checkbox */}
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
      </CTForm>

      <CTForm
        expanded
        collapsible
        padding={[10, 35]}
        id="ctform-sel"
        heading="Selections"
        details="Advacted usage of the CTForm, includes Select and AutoComplete."
        onSaveButtonText="Create" 
        onSave={() => 1}
        onCancel={() => 1}
      >
        {/* Selection */}
        <CTFormHeading>Selection</CTFormHeading>

        <CTFormRow>
          <CTSelect
            id="sel-1"
            label="Selection"
            defaultValue="opt-1"
            options={exampleOptions}
            onChange={alertValue}
          />

          <CTSelect
            underlined
            error
            id="sel-2"
            label="Underlined Selection"
            defaultValue="opt-1"
            helpText="There is an error occurred"
            options={exampleOptions}
            onChange={alertValue}
          />
        </CTFormRow>


        {/* Auto Complete */}
        <CTFormHeading>Auto Complete</CTFormHeading>

        <CTFormRow>
          <CTAutoComplete 
            label="Auto complete example"
            options={exampleOptions}
            onChange={(val) => alert(val)}
          />

          <CTAutoComplete
            underlined
            label="Underlined auto complete"
            options={exampleOptions}
            onChange={(val) => alert(val)}
          />
        </CTFormRow>
      </CTForm>
    </CTFragment>
  );
}
