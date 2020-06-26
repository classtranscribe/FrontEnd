import _ from 'lodash';
import React, { useState, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import {
  CTForm,
  CTFormRow,
  CTSelect,
  CTFormHeading
} from 'layout';
import { api, util, user } from 'utils';
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
  const [uniId, setUniId] = useState(defaultUniId);
  const [uniIdOptions, setUniIdOptions] = useState([]);
  const handleUniId = ({ target: { value } }) => setUniId(value);

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

  // get list of universities
  useEffect(() => {
    if (user.isAdmin) {
      api.getUniversities().then((res) => {
        if (res.status === 200) {
          setUniIdOptions(util.getSelectOptions(res.data, 'name'))
        }
      })
    }
  }, [])
  // reset values when uniId changed
  useEffect(() => {
    setSelCourses(defaultSelCourses)
    setLogEventsFlag(defaultLogFlag)
    setSectionName(defaultSectionName)
    setCourseName(defaultCourseName)
    setDescription(defaultDescription)
    setAccess(defaultAccessType)
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
      {user.isAdmin &&
        <div>
          <CTFormRow>
            <CTFormHeading>
              University Selection
            </CTFormHeading>
          </CTFormRow>
          <CTFormRow>
            <CTSelect
              required
              label="Select an University"
              options={uniIdOptions}
              value={uniId}
              onChange={handleUniId}
            />
          </CTFormRow>
        </div>}
      <CourseSelection {...courseSelectionProps} />
      <BasicInfo {...basicInfoProps} />
    </CTForm>
  );
}

CourseForm.propTypes = {
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