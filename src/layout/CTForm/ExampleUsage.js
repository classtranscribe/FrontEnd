import React, { useState } from 'react';
import {
  CTFragment,
  CTForm, 
  CTFormHeading, 
  CTFormHelp,
  CTFormRow, 
  CTInput,
  CTSelect,
  CTCheckbox,
  CTAutoComplete,
  CTUploadButton,
} from 'layout';

export function BasicForm() {
  const [inputVal, setInputVal] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const handleInputChange = ({ target: { value }}) => setInputVal(value);
  const handleCheckChange = ({ target: { checked }}) => setIsChecked(checked);

  return (
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
          value={inputVal}
          onChange={handleInputChange}
        />

        <CTInput
          error
          id="course-name"
          label="Input Field"
          helpText="This is the course name"
          value={inputVal}
          onChange={handleInputChange}
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
          value={inputVal}
          onChange={handleInputChange}
        />

        <CTInput
          error
          underlined
          id="course-name-2"
          label="Course Name"
          helpText="The input can be underlined"
          value={inputVal}
          onChange={handleInputChange}
        />
      </CTFormRow>


      {/* Checkbox */}
      <CTFormHeading>Checkbox</CTFormHeading>

      <CTFormRow padding={[0, 10]}>
        <CTCheckbox 
          id="log-event"
          legend="An checkbox example"
          label="Log student events"
          checked={isChecked}
          onChange={handleCheckChange}
        />
      </CTFormRow>

      <CTFormRow padding={[0, 10]}>
        <CTCheckbox
          error
          id="log-event-error"
          legend="An checkbox example with error"
          label="Log student events"
          helpText="An error occurs"
          checked={!isChecked}
          onChange={handleCheckChange}
        />
      </CTFormRow>
    </CTForm>
  );
}

export function AdvancedForm() {
  const [option, setOption] = useState('opt-1');
  const handleSelect = ({ target: { value }}) => setOption(value);

  const exampleOptions = [
    {value: 'opt-1', text: 'Computer Science'},
    {value: 'opt-2', text: 'Mathematics'},
    {value: 'opt-3', text: 'Business', description: 'A description to option 3'},
    {value: 'opt-4', text: 'Statistics', description: 'A description to option 4'}
  ];

  return (
    <CTForm
      collapsible
      padding={[10, 35]}
      id="ctform-sel"
      heading="Advanced Usage"
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
          value={option}
          onChange={handleSelect}
        />

        <CTSelect
          underlined
          error
          id="sel-2"
          label="Underlined Selection"
          defaultValue="opt-1"
          helpText="There is an error occurred"
          options={exampleOptions}
          value={option}
          onChange={handleSelect}
        />
      </CTFormRow>


      {/* Auto Complete */}
      <CTFormHeading>Auto Complete</CTFormHeading>

      <CTFormRow>
        <CTAutoComplete 
          id="auto-complete-example-1"
          label="Auto complete example"
          options={exampleOptions}
          value={option}
          onChange={(val) => setOption(val)}
        />

        <CTAutoComplete
          underlined
          id="auto-complete-example-2"
          label="Underlined auto complete"
          options={exampleOptions}
          value={option}
          onChange={(val) => setOption(val)}
        />
      </CTFormRow>
    </CTForm>
  );
}


export function UploadForm() {
  const handleFileUpload = (files) => {
    if (files.length > 0) {
      alert(`Uploaded file ${files[0].name}`);
    }
  };

  return (
    <CTForm
      collapsible
      padding={[10, 35]}
      id="ctform-upload"
      heading="Upload Usage"
      details="Usage for upload files"
    >
      <CTFormHeading>Upload Button</CTFormHeading>
      <CTUploadButton id="upload-btn" onFileChange={handleFileUpload} />

      <CTFormHeading>Fluid Upload Button</CTFormHeading>
      <CTUploadButton fluid id="upload-fluid" onFileChange={handleFileUpload} />

      <CTFormHeading>Upload Images</CTFormHeading>
      <CTFormHelp title="Usage">
        You can only upload image files
      </CTFormHelp>

      <CTUploadButton 
        id="upload-images" 
        onFileChange={handleFileUpload}
        accept="image/*"
        icon="add_a_photo"
        fluid
      >
        Browse Images
      </CTUploadButton>
    </CTForm>
  );
}

/**
 * The basic usage of the CTForm and its components
 */
export function CTFormExampleUsage() {
  return (
    <CTFragment>
      <BasicForm />
      <AdvancedForm />
      <UploadForm />
    </CTFragment>
  );
}
