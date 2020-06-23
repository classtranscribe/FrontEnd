import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import {
  CTFragment,
  CTFormHeading,
  CTFormHelp,
  CTFormRow,
  CTAutoComplete,
  CTText,
  CTHeading
} from 'layout';
import { api, util, user } from 'utils';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: 15,
    margin: 0,
    height: 'auto',
  },
  chip: {
    margin: theme.spacing(0.5),
    fontWeight: 'bold'
  },
  row: {
    width: '49%'
  }
}));

function CourseSelection(props) {
  let {
    error,
    enable,
    selCourses,
    setSelCourses,
  } = props;

  // user infomation
  const { universityId } = user.getUserInfo();
  // handle errors
  // selCoursesError: no course selected while user has clicked the 'create' button
  // noCourseSelected: no course selected
  const selCoursesError = error.includes('selCourses') && enable;
  const noCourseSelected = selCourses.length === 0;

  // manage selected depart, list of departs, selected course and list of courses
  const [depart, setDepart] = useState({});
  const [departs, setDeparts] = useState([]);

  const [course, setCourse] = useState({});
  const [courses, setCourses] = useState([]);

  const handleDepartChange = (departmentId) => {
    setDepart(_.find(departs, { id: departmentId }));
  };

  const handleCourseChange = (courseId) => {
    setCourse(_.find(courses, { id: courseId }));
  };

  const setupDepartmentOptions = async () => {
    try {
      const { data } = await api.getDepartsByUniId(universityId);
      setDeparts(data);
    } catch (error_) {
      prompt.error('Could not load departments.');
    }
  };

  const setupCourseOptions = async () => {
    try {
      const { data } = await api.getCoursesByDepartId(depart.id);
      setCourses(data);
    } catch (error_) {
      prompt.error('Could not load departments.');
    }
  };

  useEffect(() => {
    // get the list of departs
    setupDepartmentOptions();
  }, []);

  useEffect(() => {
    // Could be improved: when selected depart changed, the selected course stay the same
    if (depart.id) {
      setupCourseOptions();
    }
  }, [depart]);

  useEffect(() => {
    // add/remove selected courses
    if (course.id && depart.id) {
      setSelCourses([
        ..._.filter(selCourses, item => item.acronym !== depart.acronym), 
        { ...course, acronym: depart.acronym }
      ]);
    }
  }, [course])

  const handleDeleteSelCourses = (courseId) => () => {
    setSelCourses(_.filter(selCourses, item => item.id !== courseId));
  };


  const departmentOptions = util.getSelectOptions(departs, 'name');
  const courseOptions = util.getSelectOptions(courses, depart.acronym);

  const classes = useStyles();
  const fullNumber = _.join(_.map(selCourses, (val) => val.acronym + val.courseNumber), '/');

  return (
    <CTFragment>
      <CTFormHeading padding={[20, 0, 0, 0]}>Course Number</CTFormHeading>
      <CTFormHelp title="Course number selection">
        Since one course might be held by multiple departments (e.g. <b>CS425/ECE428</b>), 
        ClassTranscribe allows you to select multiple course numbers. 
        For example, you can select <b>CS357</b> and <b>MATH357</b> respectively to 
        generate the course number <b>CS357/MATH357</b>.
      </CTFormHelp>
      
      <CTFormRow>
        <div>
          <CTAutoComplete
            error={selCoursesError}
            underlined
            id="sel-dep"
            label="Select a Department"
            options={departmentOptions}
            value={depart.id}
            onChange={handleDepartChange}
          />

          <CTAutoComplete
            error={selCoursesError}
            helpText={selCoursesError ? 'Please select at least one course number.' : ''}
            className="mt-3"
            underlined
            disabled={depart === ''}
            id="sel-courses"
            label="Select a Course Number"
            defaultValue=""
            options={courseOptions}
            value={course.id}
            onChange={depart === '' ? undefined : handleCourseChange}
          />
        </div>

        <div>
          <Paper className={classes.root} elevation={1}>
            <CTHeading as="h4" uppercase>
              Selected Courses
              {
                !noCourseSelected 
                &&
                `: ${ fullNumber}`
              }
            </CTHeading>

            {
              noCourseSelected 
              && 
              <CTText muted margin={10} center>No course number selected</CTText>
            }

            {selCourses.map((item) => {
              return (
                <Chip
                  key={item.id}
                  label={item.acronym + item.courseNumber}
                  onDelete={handleDeleteSelCourses(item.id)}
                  className={classes.chip}
                />
              );
            })}
          </Paper>
        </div>
      </CTFormRow>
    </CTFragment>
  );
}

export default CourseSelection;