import _ from 'lodash';
import React, { useState, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { CTForm } from 'layout';
import { api, user, prompt } from 'utils';
import PublishStatus from 'entities/PublishStatus';
import UniversitySelection from './UniversitySelection';
import CourseSelection from './CourseSelection';
import BasicInfo from './BasicInfo';
import Visibility from './Visibility';


function CourseForm(props) {
  const {
    collapsible = false,
    defaultCourseName = '',
    defaultSectionName = '',
    defaultLogFlag = true,
    defaultTerm = '',
    defaultDescription = '',
    defaultAccessType = '1',
    defaultPublishStatus = PublishStatus.Published,
    defaultSelCourses = [],
    saveButtonText = 'create',
    onSave,
    allowVisibility = false,
    allowUniSelection = false,
  } = props;

  const defaultUniId = user.getUserInfo().universityId;

  // basic information
  const [courseName, setCourseName] = useState(defaultCourseName);
  const [sectionName, setSectionName] = useState(defaultSectionName);
  const [term, setTerm] = useState(defaultTerm);
  const [logEventsFlag, setLogEventsFlag] = useState(defaultLogFlag);
  const [description, setDescription] = useState(defaultDescription);
  const [accessType, setAccess] = useState(defaultAccessType);
  const [publishStatus, setPublishStatus] = useState(defaultPublishStatus);
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
      const newCourse = {
        sectionName,
        termId: term,
        accessType,
        logEventsFlag,
        courseName,
        description,
        courseIds: selCourses.map((course) => course.id),
      };

      if (allowVisibility) newCourse.publishStatus = publishStatus;
      onSave(newCourse);
    }
  };

  const uniSelProps = {
    uniId,
    universities,
    handleUniChange
  };

  const basicInfoProps = {
    error,
    enable,
    courseName,
    sectionName,
    term,
    description,
    coursesText,
    setCourseName,
    setSectionName,
    setTerm,
    setDescription,
    setCoursesText,
    uniId
  };

  const visibilityProps = {
    accessType,
    logEventsFlag,
    publishStatus,
    setAccess,
    setLogEventsFlag,
    setPublishStatus
  };

  const courseSelectionProps = {
    error,
    enable,
    selCourses,
    setSelCourses,
    uniId
  };

  return (
    <CTForm
      heading="Course Information"
      padding={[10, 35]}
      id="ctform-basics"
      onSave={handleSave}
      onSaveButtonText={saveButtonText}
      collapsible={collapsible}
      details="Course number, name, section, term, and description."
    >
      {/** 
        * Temporarily disable this feature for admins
        * Need new "get-offerings-by-instructor" APIs to avoid errors
        */}
      {/* {allowUniSelection && <UniversitySelection {...uniSelProps} />} */}

      <CourseSelection {...courseSelectionProps} />
      <BasicInfo {...basicInfoProps} />

      {allowVisibility && <Visibility {...visibilityProps} />}
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
  defaultPublishStatus: PropTypes.number,
  defaultSelCourses: PropTypes.array,
  saveButtonText: PropTypes.string,
  onSave: PropTypes.func,
  allowUniSelection: PropTypes.bool,
  allowVisibility: PropTypes.bool
};

export default CourseForm;
