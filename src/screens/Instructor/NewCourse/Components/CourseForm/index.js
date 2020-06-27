import _ from 'lodash';
import React, { useState, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import {
  CTForm,
  CTFormRow,
  CTSelect,
  CTFormHeading
} from 'layout';
import { api, util, user, prompt } from 'utils';
import BasicInfo from './BasicInfo';
import CourseSelection from './CourseSelection';


function CourseForm(props) {
  const {
    collapsible = false,
    defaultCourseName = '',
    defaultSectionName = '',
    defaultLogFlag = false,
    defaultTerm = '',
    defaultDescription = '',
    defaultAccessType = '0',
    defaultSelCourses = [],
    onSave,
  } = props;

  const defaultUniId = user.getUserInfo().universityId;

  // basic information
  const [courseName, setCourseName] = useState(defaultCourseName);
  const [sectionName, setSectionName] = useState(defaultSectionName);
  const [term, setTerm] = useState(defaultTerm);
  const [logEventsFlag, setLogEventsFlag] = useState(defaultLogFlag);
  const [description, setDescription] = useState(defaultDescription);
  const [accessType, setAccess] = useState(defaultAccessType);
  const [coursesText, setCoursesText] = useState('');

  const [universities, setUniversities] = useState([]);
  const [uniId, setUniId] = useState(defaultUniId);
  const handleUniChange = ({ target: { value } }) => setUniId(value);

  // course selection
  const [selCourses, setSelCourses] = useState(defaultSelCourses);
  // errors
  const initErrors = [];
  const errorReducer = (error, action) => {
    if (Array.isArray(action)) {
      if (action[0]) {
        return _.concat(error, action[1]);
      }
      return _.pull(error, action[1]);
    }
    return error;
  };

  const setupUniveristies = async () => {
    try {
      const { data } = await api.getUniversities();
      setUniversities(data);
    } catch (error) {
      prompt.error('Could not load universities.');
    }
  };

  // get list of universities
  useEffect(() => {
    if (user.isAdmin) {
      setupUniveristies();
    }
  }, []);

  // reset values when uniId changed
  useEffect(() => {
    setSelCourses(defaultSelCourses);
  }, [uniId])

  const [error, errorDispatch] = useReducer(errorReducer, initErrors);
  const [enable, setEnable] = useState(false);

  useEffect(() => {
    errorDispatch([courseName === '', 'courseName']);
    errorDispatch([sectionName === '', 'sectionName']);
    errorDispatch([selCourses.length === 0, 'selCourses']);
  }, [courseName, sectionName, selCourses]);

  // save information provided
  const handleSave = async () => {
    setEnable(true);
    if (error.length === 0 && typeof onSave === 'function') {
      onSave({
        sectionName,
        termId: term,
        accessType,
        logEventsFlag,
        courseName,
        description,
        courseIds: selCourses.map(course => course.id)
      });
    }
  };

  const basicInfoProps = {
    error,
    enable,
    courseName,
    sectionName,
    term,
    accessType,
    description,
    logEventsFlag,
    coursesText,
    setCourseName,
    setSectionName,
    setTerm,
    setAccess,
    setDescription,
    setLogEventsFlag,
    setCoursesText,
    uniId
  };

  const courseSelectionProps = {
    error,
    enable,
    selCourses,
    setSelCourses,
    uniId
  };

  const uniOptions = util.getSelectOptions(universities, 'name');

  return (
    <CTForm
      heading="Course Information"
      padding={[10, 35]}
      id="ctform-basics"
      onSave={handleSave}
      onSaveButtonText="Create"
      collapsible={collapsible}
      details="The basic information for a course"
    >
      {
        user.isAdmin 
        &&
        <>
          <CTFormHeading>University Selection</CTFormHeading>
          <CTFormRow>
            <CTSelect
              required
              label="Select an University"
              options={uniOptions}
              value={uniId}
              onChange={handleUniChange}
            />
          </CTFormRow>
        </>
      }

      <CourseSelection {...courseSelectionProps} />
      <BasicInfo {...basicInfoProps} />
    </CTForm>
  );
}

CourseForm.propTypes = {
  collapsible: PropTypes.bool,
  defaultCourseName: PropTypes.string,
  defaultSectionName: PropTypes.string,
  defaultLogFlag: PropTypes.bool,
  defaultTerm: PropTypes.string,
  defaultDescription: PropTypes.string,
  defaultAccessType: PropTypes.string,
  defaultSelCourses: PropTypes.array,
  onSave: PropTypes.func
};

export default CourseForm;