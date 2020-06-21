import React, { useState, useEffect, useReducer } from 'react';
import {
  CTForm
} from 'layout';
import { api, util, user, prompt, links } from 'utils';
import './index.scss';
import _ from 'lodash';
import { useHistory } from 'react-router-dom'
import { BasicInfo } from './BasicInfo'
import { CourseSelection } from './CourseSelection'
import { CourseContext } from './ContextProvider'

export function CourseForm(props) {
  let {
    defaultCourseName = '',
    defaultSectionName = '',
    defaultLogFlag = false,
    defaultTerm = '',
    defaultDescription = '',
    defaultAccessType = '0',
    defaultSelCourses = []
  } = props;
  const history = useHistory();
  // basic information
  const [courseName, setcourseName] = useState(defaultCourseName);
  const [sectionName, setsectionName] = useState(defaultSectionName);
  const [term, setTerm] = useState(defaultTerm);
  const [logEventsFlag, setLogEventsFlag] = useState(defaultLogFlag);
  const [description, setDescription] = useState(defaultDescription);
  const [accessType, selAccess] = useState(defaultAccessType);
  const [coursesText, setCoursesText] = useState('');

  useEffect(() => {
    api.getTermsByUniId(user.getUserInfo().universityId).then((res) => {
      if (res.status === 200 && res.data[0]) {
        setTerm(res.data[0].id)
      }
    })
  }, [])
  // course selection
  const [selCourses, setSelCourses] = useState(defaultSelCourses);
  // errors
  const initErrors = [];
  const errorReducer = (error, action) => {
    if (Array.isArray(action)) {
      if (action[0]) {
        return _.concat(error, action[1])
      }
      return _.pull(error, action[1])
    }
    return error
  }
  const [error, errorDispatch] = useReducer(errorReducer, initErrors)
  const [enable, setEnable] = useState(false);

  useEffect(() => {
    if (courseName === '') {
      errorDispatch([true, 'courseName'])
    } else {
      errorDispatch([false, 'courseName']);
    }
    if (sectionName === '') {
      errorDispatch([true, 'sectionName'])
    } else {
      errorDispatch([false, 'sectionName'])
    }
    if (selCourses.length === 0) {
      errorDispatch([true, 'selCourses'])
    } else {
      errorDispatch([false, 'selCourses'])
    }
  }, [courseName, sectionName, selCourses])

  const handleCancel = () => {
    history.push(links.instructor())
  };
  // save information provided
  const handleSave = async () => {
    let offeringId = null;
    setEnable(true);
    try {
      if (error.length === 0) {
        const { userId } = user.getUserInfo();
        const courseId = selCourses[0][2]
        const { data } = await api.createOffering(
          {
            offering: {
              sectionName,
              termId: term,
              accessType,
              logEventsFlag,
              courseName,
              description
            },
            courseId,
            instructorId: userId
          }
        )
        offeringId = data.id;
        prompt.addOne({
          text: 'Course Created.',
          header: 'Success',
          status: 'success',
          timeout: 2200,
          position: 'top',
          offset: [-1, -1],
        }, false)
      }
      if (offeringId !== null) {
        history.push(links.offeringDetail(offeringId))
      }
    } catch (err) {
      return;
    }
    for (let i = 0; i < selCourses.length; i += 1) {
      await api.createCourseOffering({ courseId: selCourses[i][2], offeringId }).catch(
        () => {
          console.error(`failed to add course ${selCourses[i]}`);
        }
      )
    }
  };

  return (
    <CourseContext.Provider
      value={{
        error,
        errorDispatch,
        enable,
        courseName,
        sectionName,
        setsectionName,
        setcourseName,
        term,
        setTerm,
        logEventsFlag,
        setLogEventsFlag,
        description,
        setDescription,
        accessType,
        selAccess,
        selCourses,
        setSelCourses,
        coursesText,
        setCoursesText
      }}
    >

      <CTForm
        heading="Course Information Form"
        padding={[10, 35]}
        id="ctform-basics"
        onSave={handleSave}
        onSaveButtonText="Create"
        onCancel={handleCancel}
      >
        <CourseSelection />
        <BasicInfo />
      </CTForm>
    </CourseContext.Provider>

  );
}