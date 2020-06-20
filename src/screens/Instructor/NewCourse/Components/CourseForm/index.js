import React, { useState, useEffect, useReducer } from 'react';
import {
  CTForm
} from 'layout';
import { api, util, user, prompt } from 'utils';
import './index.scss';
import _ from 'lodash';
import {BasicInfo} from './BasicInfo'
import {CourseSelection} from './CourseSelection'

export const CourseContext = React.createContext();

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

export function CourseForm({
  defaultCourseName = '',
  defaultSectionName = '',
  defaultLogFlag = false,
  defaultTerm = '',
  defaultDescription = '',
  defaultAccessType = '0',
  defaultSelCourses = []
}) {
  // basic information
  const [courseName, setcourseName] = useState(defaultCourseName);
  const [sectionName, setsectionName] = useState(defaultSectionName);
  const [term, setTerm] = useState(defaultTerm);
  const [logEventsFlag, setLogEventsFlag] = useState(defaultLogFlag);
  const [description, setDescription] = useState(defaultDescription);
  const [accessType, selAccess] = useState(defaultAccessType);
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
      errorDispatch([false, 'sectionName'])}
    if (selCourses.length === 0) {
      errorDispatch([true, 'selCourses'])
    } else {
      errorDispatch([false, 'selCourses'])
    }
  }, [courseName, sectionName, selCourses])

  const handleCancel = () => {
    window.open('/instructor/', "_self")
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
          text : 'Course Created!',
          header :'Success',
          status : 'success',
          timeout : 2000,
          position : 'top',
          offset : [-1, -1],
        } ,false)
      }
    } catch (err) {
      return;
    }
    
    _.forEach(selCourses, async (val) => {
      await api.createCourseOffering({courseId: val[2], offeringId}).catch(
        ()=>{
          console.error(`failed to add course ${val}`);
        }
      )
    })
    setTimeout(() => window.open('/instructor/', "_self"), 2100)
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