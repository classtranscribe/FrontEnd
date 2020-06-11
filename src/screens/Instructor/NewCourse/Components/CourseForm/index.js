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
  const emptyCourseName = errors.includes('courseName');
  const emptySecName = errors.includes('sectionName');

  const handleCancel = () => 1;
  // handle course name
  const [courseName, setcourseName] = useState('');
  const setCourseName = ({ target: { value }}) => setcourseName(value);
  // handle section name
  const [sectionName, setsectionName] = useState('');
  const setSectionName = ({ target: { value }}) => setsectionName(value);
  // handle term
  const [term, selTerm] = useState('');
  const [terms, setTerms] = useState([]);
  const handleTerm = ({ target: { value }}) => selTerm(value);
  // handle course number (department + course)
  const [depart, setDepart] = useState('');
  const [departs, setDeparts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState('');
  const [selCourses, setSelCourses] = useState([]);

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
      // before: !iterm || !item.id
      // fixed here, id coule be 0 for termId
      if (!item || item.id === undefined) return;
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

  // Assign terms, departs and courses
  const getTerms = async () => {
    try {
      const res = await api.getTermsByUniId(uniId);
      if (res.status === 200) {
        return util.getSelectOptions(res.data, 'term')
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
        return util.getSelectOptions(res.data, 'name')
      } 
        return [];
    } catch (err) {
      return [];
    }
  }

  useEffect(async () => {
    setTerms(await getTerms());
    setDeparts(await getDepartments());
  }, [])

  useEffect( () => {
    // Need improvements here
    if (depart) {
      api.getCoursesByDepartId(depart).then( res => {
        api.getDepartById(depart).then(name => {
          if (res && name) {
            setCourses(util.getSelectOptions(res.data, name.data.acronym));
            setCourse('');
          }
        })
      });
    }
    setCourse('');
  }, [depart])

  // useEffect( () => {
  //   setCourse('');
  // }, [depart])
  

  const [accessType, selAccess] = useState('');
  const handleVisibility = ({ target: { value }}) => selAccess(value);

  // save information provided
  const handleSave = async () => {
    if (courseName) {
      _.concat(errors, 'courseName');
    }
    // testing 
     // console.log(course);
   // console.log(errors);
    // console.log(await api.getCoursesByDepartId(depart))
    // console.log(user.getUserInfo().universityId);
    if (errors === []) {
      api.createCourseOffering({
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
          className='sel-dep info'
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
          className='sel-courses info'
          underlined
          disabled={depart === ''}
          id="sel-courses"
          label="Select Courses"
          defaultValue=""
          options={courses}
          value={course}
          onChange={onCourseChange}
        />
      </CTFormRow>
      <CTFragment>
        <CTFormHeading>
          Selected Courses
        </CTFormHeading>
      </CTFragment>
      <CTFormHeading>Basic Information</CTFormHeading>
      <CTFormRow>
        <CTInput
          required
          id="course-name"
          error={emptyCourseName}
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