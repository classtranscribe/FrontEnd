import React, { useState, useEffect } from 'react';
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
import { CTHeading } from 'layout/CTHeading';
import { api, util, user } from 'utils';
import './index.scss';
import _ from 'lodash';

export function CourseForm() {
  // user infomation
  const uniId = user.getUserInfo().universityId;
  // errors
  const [errors, setErrors] = useState([]);

  const handleCancel = () => 1;
  // handle course name
  const [courseName, setcourseName] = useState('');
  const setCourseName = ({ target: { value }}) => setcourseName(value);
  // handle section name
  const [sectionName, setsectionName] = useState('');
  const setSectionName = ({ target: { value }}) => setsectionName(value);
  // handle term
  const [term, selTerm] = useState('');
  const handleTerm = ({ target: { value }}) => selTerm(value);
  // handle course number (department + course)
  const [depart, setDepart] = useState('2001');
  const [departs, setDeparts] = useState([{value: '2001', text: ''}]);
  const [courses, setCourses] = useState([{value: 'test', text: ''}]);
  const [course, setCourse] = useState('test');
  const [selCourses, setSelCourses] = useState([]);
  const NotSetDepart = depart === '0';

  const onDepartChange = (value) => {
    setDepart(value);
  };
  const onCourseChange = (value) => {
    setCourse(value);
  };

  const getSelectOptions = (array = [], tag) => {
    if (!Array.isArray(array)) return [];
    const options = [];
    array.forEach((item) => {
      if (!item) return;
      let text = '';
      if ((tag === 'depart' || tag === 'term') && item.uniName) {
        text = `${item.name} (${item.uniName})`;
      } else if (tag === 'depart') {
        text = [item.name, item.acronym]
      }
      else {
        text = item.name || tag + item.courseNumber;
      }
      options.push({ text, value: item.id });
    });
    return options;
  };

  // Assign terms, departs and courses
  const getTerms = async () => {
    try {
      const res = await api.getTermsByUniId(uniId);
      if (res.status === 200) {
        return getSelectOptions(res.data, 'term')
      } 
        return [];
    } catch (err) {
      return [];
    }
  };
  const getDepartments = async () => {
    try {
      const res = await api.getDepartsByUniId(uniId);
      if (res.status === 200) {
        return getSelectOptions(res.data, 'name')
      } 
        return [];
    } catch (err) {
      return [];
    }
  }
  const getCourses = async () => {
    try {
      const res = await api.getCoursesByDepartId(depart);
      const name = await api.getDepartById(depart);
      if (res.status === 200) {
        return getSelectOptions(res.data, name.data.acronym)
      } 
        return [];
    } catch (err) {
      return [];
    }
  }
  const [terms, setTerms] = useState([]);
  useEffect(async () => {
    setTerms(await getTerms());
    setDeparts(await getDepartments());
    setCourses(await getCourses());
  }, [])
  

  const [accessType, selAccess] = useState('');
  const handleVisibility = ({ target: { value }}) => selAccess(value);

  // save information provided
  const handleSave = async () => {
    // testing 
    // console.log(departs);
    // console.log(depart);
    // console.log(courses);
    // console.log(await api.getCoursesByDepartId(depart))
    // console.log(user.getUserInfo().universityId);
    if (errors === []) {
      api.createOffering({
        "sectionName": sectionName,
        "termId": term,
        "accessType": accessType,
        "logEventsFlag": false,
        "courseName": courseName,
        "description": null,
        "jsonMetadata": null,
        "visibility": 0,
        "id": "1111"
    })}
  };

  return (
    <CTForm
      heading="Course Information Form"
      padding={[10, 35]} 
      id="ctform-basics" 
      onSave={handleSave}
      onSaveButtonText="Create" 
      onCancel={handleCancel}
    >
      <CTFormHeading>Course Number</CTFormHeading>
      <CTFormRow>
        <CTAutoComplete 
          underlined
          id="sel-dep"
          label="Select a Department"
          options={departs}
          value={depart}
          onChange={onDepartChange}
        />
      </CTFormRow>
      <CTFormRow>
        <CTAutoComplete 
          underlined
          disabled={NotSetDepart}
          id="sel-courses"
          label="Select Courses"
          options={courses}
          value={course}
          onChange={onCourseChange}
        />
      </CTFormRow>
        
      <CTFragment list>
        <CTHeading as='h4'>Selected Courses</CTHeading>
      </CTFragment>
      <CTFormHeading>Basic Information</CTFormHeading>
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
          required
          error={false}
          id="sel-1"
          label="Select a Term"
          defaultValue=""
          options={terms}
          value={term}
          onChange={handleTerm}
        />
        <CTSelect
          required 
          id="sel-1"
          label="Visibility"
          helpText="Choose the user group of this course."
          defaultValue=""
          options={getSelectOptions(api.offeringAccessType, 'id', 'name', 'description')}
          value={accessType}
          onChange={handleVisibility}
        />
      </CTFormRow>
     
    </CTForm>
  );
}