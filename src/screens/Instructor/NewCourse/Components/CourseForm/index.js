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

export function CourseForm(off) {
  // basic information
  const [courseName, setcourseName] = useState('');
  const [sectionName, setsectionName] = useState('');
  const [term, setTerm] = useState('0001');
  const [logEventsFlag, setLogEventsFlag] = useState(false);
  const [description, setDescription] = useState('');
  const [accessType, selAccess] = useState('0');
  // course selection
  const [selCourses, setSelCourses] = useState([]);

  // errors
  const [error, errorDispatch] = useReducer(errorReducer, initErrors)
  const [enable, setEnable] = useState(false);

  const reset = () => {
    setcourseName('')
    setsectionName('')
    setTerm('0001')
    setLogEventsFlag(false)
    setDescription('')
    selAccess('0')
    setSelCourses([])
    setEnable(false)
  }
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

  const handleCancel = () => 1;
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
        reset()
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