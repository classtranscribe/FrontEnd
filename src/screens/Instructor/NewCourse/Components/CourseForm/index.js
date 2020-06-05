import React, { Component, useState } from 'react';
import { CTLayout ,
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

import { CTFormExampleUsage } from 'layout/CTForm/ExampleUsage';
import { api } from 'utils';
import './index.scss';

export function CourseForm() {
  const [inputVal, setInputVal] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  
  
  const [option, setOption] = useState('opt-1');

  const handleSelect = ({ target: { value }}) => setOption(value);

  const handleInputChange = ({ target: { value }}) => setInputVal(value);
  const handleCheckChange = ({ target: { checked }}) => setIsChecked(checked);
  const handleSave = () => 1;
  const handleCancel = () => 1;
  const [courseName, setcourseName] = useState('');
  const setCourseName = ({ target: { value }}) => setcourseName(value);
  const [sectionName, setsectionName] = useState('');
  const setSectionName = ({ target: { value }}) => setsectionName(value);
  return (
    <CTForm
      heading="Information"
      padding={[10, 35]} 
      id="ctform-basics" 
      onSave={handleSave}
      onSaveButtonText="Create" 
      onCancel={handleCancel}
    >
      <CTFormRow>
        <CTInput
          required
          id="course-name"
          label="Course Name"
          placeholder="Course Name"
          value={courseName}
          onChange={setCourseName}
        />
        <CTInput
          required
          id="section-name"
          label="Section Name"
          placeholder="Section Name"
          value={sectionName}
          onChange={setSectionName}
        />
      </CTFormRow>
      <CTFormRow>
        <CTSelect
          underlined
          id="sel-term"
          label="Select Term"
          defaultValue="Term"
          options={[api.getTermById(0)]}
          value={option}
          onChange={handleSelect}
        />
        <CTSelect
          underlined
          id="vis-type"
          label="Visibility"
          defaultValue="Visibility"
          options={[api.getTermById(0)]}
          value={option}
          onChange={handleSelect}
        />
      </CTFormRow>
    </CTForm>
  );
}