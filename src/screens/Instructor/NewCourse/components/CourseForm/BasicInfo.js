import React, { useState, useEffect } from 'react';
import {
  CTFragment,
  CTFormHeading,
  CTFormRow,
  CTInput,
  CTSelect,
} from 'layout';
import { api, prompt, _getSelectOptions } from 'utils';

function BasicInfo(props) {
  const {
    error,
    enable,
    courseName,
    sectionName,
    term,
    description,
    setCourseName,
    setSectionName,
    setTerm,
    setDescription,
    uniId
  } = props;

  const [terms, setTerms] = useState([]);

  // errors
  const emptyCourseName = error.includes('courseName') && enable;
  const emptySecName = error.includes('sectionName') && enable;

  // handle basic info
  const handleCourseNameChange = ({ target: { value } }) => {
    setCourseName(value);
  };

  const handleSectionNameChange = ({ target: { value } }) => {
    setSectionName(value);
  };

  const handleTermChange = ({ target: { value } }) => {
    setTerm(value);
  };

  const handleDescriptionChange = ({ target: { value } }) => {
    setDescription(value);
  };

  const setupTermOptions = async () => {
    try {
      const { data } = await api.getTermsByUniId(uniId);
      let _terms = _getSelectOptions(data, 'term');
      _terms = _terms.slice().reverse();
      if (_terms[0]) {
        _terms[0].description = 'Current term';
      }
      setTerms(_terms);

      if (_terms.length > 0) {
        if (!term) setTerm(_terms[0].value);
      }
    } catch (error_) {
      prompt.error('Could not load terms.');
    }
  };

  useEffect(() => {
    // Get terms list
    setupTermOptions();
  }, [uniId]);

  return (
    <CTFragment>
      <CTFormHeading>Basic Information</CTFormHeading>

      <CTFormRow maxWidth="600px">
        <CTInput
          required
          id="course-name"
          error={emptyCourseName}
          label="Course Name"
          placeholder="Course Name"
          value={courseName}
          onChange={handleCourseNameChange}
          helpText={emptyCourseName ? "Course Name is required." : ''}
        />
      </CTFormRow>

      <CTFormRow maxWidth="600px">
        <CTInput
          required
          id="section-name"
          error={emptySecName}
          label="Section Name"
          placeholder="Section Name"
          value={sectionName}
          onChange={handleSectionNameChange}
          helpText={emptySecName ? "Section Name is required." : ''}
        />
      </CTFormRow>

      <CTFormRow maxWidth="600px">
        <CTSelect
          required
          error={false}
          id="sel-1"
          label="Term/Semester"
          options={terms}
          value={term}
          onChange={handleTermChange}
        />
      </CTFormRow>

      <CTFormRow maxWidth="600px">
        <CTInput
          textarea
          rowsMax={10}
          id="course-description"
          helpText="The description for this class"
          label="Course description"
          value={description}
          onChange={handleDescriptionChange}
        />
      </CTFormRow>
    </CTFragment>
  );
}

export default BasicInfo;