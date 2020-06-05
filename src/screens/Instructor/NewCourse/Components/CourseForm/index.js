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
import { api, util } from 'utils';
import './index.scss';

export function CourseForm() {
  const [errors, setErrors] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const handleCancel = () => 1;
  const [courseName, setcourseName] = useState('');
  const setCourseName = ({ target: { value }}) => setcourseName(value);
  const [sectionName, setsectionName] = useState('');
  const setSectionName = ({ target: { value }}) => setsectionName(value);

  const [term, selTerm] = useState('');
  const handleTerm = ({ target: { value }}) => selTerm(value);

  const getSelectOptions = (array = [], tag) => {
    if (!Array.isArray(array)) return [];
    const options = [];
    array.forEach((item) => {
      if (!item) return;
      let text = '';
      if ((tag === 'depart' || tag === 'term') && item.uniName) {
        text = `${item.name} (${item.uniName})`;
      } else {
        text = item.name || tag + item.courseNumber;
      }
      options.push({ text, value: item.id });
    });
    return options;
  };

  const [accessType, selAccess] = useState('');
  const handleVisibility = ({ target: { value }}) => selAccess(value);

  const handleSave = () => {
    if (errors === []) {
      api.createOffering({
        "sectionName": "AB",
        "termId": "0001",
        "accessType": 0,
        "logEventsFlag": false,
        "courseName": "Test Course",
        "description": null,
        "jsonMetadata": null,
        "visibility": 0,
        "id": "1111"
    })}
    };
const exampleOptions = [
  {value: 'opt-1', text: 'Computer Science'},
  {value: 'opt-2', text: 'Mathematics'},
  {value: 'opt-3', text: 'Business'},
  {value: 'opt-4', text: 'Statistics'}
];

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
          error={term === ''}
          underlined
          id="sel-term"
          label="Select Term"
          defaultValue=""
          options={[{value: 'opt-1', text: 'Test Term'}]}
          value={term}
          onChange={handleTerm}
        />
        <CTSelect
          underlined
          id="vis-type"
          label="Visibility"
          defaultValue="0"
          options={getSelectOptions(api.offeringAccessType, 'name')}
          value={accessType}
          onChange={handleVisibility}
        />
      </CTFormRow>
    </CTForm>
  );
}