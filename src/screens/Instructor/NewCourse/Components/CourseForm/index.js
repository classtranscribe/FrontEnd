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

export default function CourseForm() {
  const [inputVal, setInputVal] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  
  const [option, setOption] = useState('opt-1');

  const handleSelect = ({ target: { value }}) => setOption(value);

  const handleInputChange = ({ target: { value }}) => setInputVal(value);
  const handleCheckChange = ({ target: { checked }}) => setIsChecked(checked);

  return (
    <CTForm
      heading="Information"
      padding={[10, 35]} 
      id="ctform-basics" 
      onSave={() => 1}
      onCancel={() => 1}
    >
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
          required
          id="section-name"
          label="Section Name"
          placeholder="Section Name"
          value={inputVal}
          onChange={handleInputChange}
        />
      </CTFormRow>
      <CTFormRow>
        <CTInput
          required
          id="course-name"
          label="Course Name"
          placeholder="Course Name"
          value={inputVal}
          onChange={handleInputChange}
        />
      </CTFormRow>
      
      <CTFormRow>
        <CTInput
          required
          id="section-name"
          label="Section Name"
          placeholder="Section Name"
          value={inputVal}
          onChange={handleInputChange}
        />
        <CTSelect
          underlined
          id="sel-term"
          label="Select Term"
          defaultValue="Term"
          options={[api.getTermById(5)]}
          value={option}
          onChange={handleSelect}
        />
      </CTFormRow>
    </CTForm>
  );
}