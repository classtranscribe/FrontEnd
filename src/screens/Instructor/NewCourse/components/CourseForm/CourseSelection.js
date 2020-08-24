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
import { api, prompt, _getSelectOptions } from 'utils';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: 15,
    margin: 0,
    height: 'auto',
    boxShadow: 'none',
    border: '1px solid rgb(218, 218, 218);'
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
    uniId
  } = props;

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
      const { data } = await api.getDepartsByUniId(uniId);
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
    if (uniId) {
      // reset when uniId changed
      setCourses([]);
      setDeparts([]);
      setCourse({});
      setDepart({});
      // get the list of departs
      setupDepartmentOptions();
    }
  }, [uniId]);

  useEffect(() => {
    if (depart.id) {
      setupCourseOptions();
    }
  }, [depart]);

  useEffect(() => {
    // add/remove selected courses
    if (course.id && depart.id) {
      setSelCourses([
        ..._.filter(selCourses, item => item.acronym !== depart.acronym),
        { ...course, departmentAcronym: depart.acronym }
      ]);
    }
  }, [course])

  const handleDeleteSelCourses = (courseId) => () => {
    setSelCourses(_.filter(selCourses, item => item.id !== courseId));
  };


  const departmentOptions = _getSelectOptions(departs, 'name');
  const courseOptions = _getSelectOptions(courses, depart.acronym);

  const classes = useStyles();
  const fullNumber = _.join(
    _.map(selCourses, (val) => val.departmentAcronym + val.courseNumber), 
    '/'
  );

  return (
    <CTFragment>
      <CTFormHeading>Course Number</CTFormHeading>
      <CTFormHelp title="Course number selection">
        <div>
          ClassTranscribe allows you to select multiple course numbers.
          For example, you can select <b>CS357</b> and <b>MATH357</b> respectively to
          generate the course number <b>CS357/MATH357</b>.
        </div>
        <h5 className="mt-2 mb-1">INSTRUCTION</h5>
        <ol>
          <li>Please select a department of your university.</li>
          <li>Then select a course under the selected department.</li>
          <li>Repeat the above steps to select multiple courses.</li>
        </ol>
      </CTFormHelp>

      <CTFormRow>
        <div>
          {
            departs.length > 0
            &&
            <CTAutoComplete 
              required
              error={selCoursesError}
              underlined
              id="sel-dep"
              label="Select a Department"
              options={departmentOptions}
              value={depart.id}
              onChange={handleDepartChange}
            />
          }

          {
            courses.length > 0
            &&
            <CTAutoComplete
              required
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
          }
        </div>

        <div>
          <Paper className={classes.root} elevation={1}>
            <CTHeading as="h4" uppercase>
              Selected Courses
              {
                !noCourseSelected
                &&
                `: ${fullNumber}`
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
                  label={item.departmentAcronym + item.courseNumber}
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