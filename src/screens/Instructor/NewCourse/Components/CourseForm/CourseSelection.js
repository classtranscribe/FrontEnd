import React, { useState, useEffect } from 'react';
import {
  CTFragment,
  CTFormHeading,
  CTFormHelp,
  CTFormRow,
  CTAutoComplete
} from 'layout';
import { api, util } from 'utils';
import './index.scss';
import _ from 'lodash';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

export function CourseSelection(props) {
  let {
    selCourses,
    setSelCourses,
    enable,
    error,
    uniId
  } = props;
  // Styling for the course selection section
  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      listStyle: 'none',
      padding: theme.spacing(0.5),
      margin: 0,
      height: theme.spacing(6),
      color: "gray",
    },
    chip: {
      margin: theme.spacing(0.5),
    },
    row: {
      width: '49%'
    }
  }))
  const classes = useStyles()

  // handle errors
  // selCoursesError: no course selected while user has clicked the 'create' button
  // noCourseSelected: no course selected
  const selCoursesError = error.includes('selCourses') && enable;
  const noCourseSelected = selCourses.length === 0;
  // manage selected depart, list of departs, selected course and list of courses
  const [depart, setDepart] = useState('');
  const [departs, setDeparts] = useState([]);

  const [course, setCourse] = useState('');
  const [courses, setCourses] = useState([]);

  const onDepartChange = (value) => {
    setDepart(value);
  };
  const onCourseChange = (value) => {
    setCourse(value);
  };
  useEffect(() => {
    setCourses([])
    setDeparts([])
    setCourse('')
    setDepart('')
    setSelCourses([])
  }, [uniId])
  // get the list of departs
  useEffect(() => {
    api.getDepartsByUniId(uniId).then((res) => {
      if (res.status === 200) {
        setDeparts(util.getSelectOptions(res.data, 'name'))
      }
    })
  }, [uniId])

  useEffect(() => {
    // Could be improved: when selected depart changed, the selected course stay the same
    if (depart) {
      api.getCoursesByDepartId(depart).then(res => {
        api.getDepartById(depart).then(name => {
          if (res && name) {
            setCourses(util.getSelectOptions(res.data, name.data.acronym))
          }
        })
      })
    }
  }, [depart, uniId])

  // add/remove selected courses

  useEffect(() => {
    if (course) {
      api.getCourseById(course).then(res => {
        if (res && res.status === 200) {
          api.getDepartById(res.data.departmentId).then(name => {
            if (name) {
              if (_.flattenDeep(selCourses).includes(name.data.acronym)) {
                setSelCourses(_.remove(selCourses, (elem) => {
                  return elem[0] === name.data.acronym
                }))
              }
              setSelCourses(
                [...selCourses,
                [name.data.acronym, res.data.courseNumber, res.data.id]])
            }
          })
        }
      })
    }
  }, [course])

  const handleDelete = (chipToDelete) => () => {
    setSelCourses(
      (chips) => chips.filter((chip) => chip !== chipToDelete)
    );
  };


  return (
    <CTFragment>
      <CTFormHelp title="Why multiple course number?">
        Some offerings may be held by multiple departments.
        For Example, CS425 and ECE428 are the same course.<br />
        Note that for each department, only one course number can be selected.
      </CTFormHelp>
      <CTFormRow>
        <CTFormHeading>{`Course Number ${_.join(_.map(selCourses, (val) => val[0] + val[1]), '/')}`}
        </CTFormHeading>
        <CTFormHeading>Selected Courses</CTFormHeading>
      </CTFormRow>
      <CTFormRow>
        <CTAutoComplete
          error={selCoursesError}
          underlined
          id="sel-dep"
          label="Select a Department"
          options={departs}
          value={depart}
          onChange={onDepartChange}
        />
        <Paper className={classes.root} elevation={1}>
          {noCourseSelected ? 'No course number selected' : ''}
          {selCourses.map((data) => {
            return (
              <Chip
                label={_.dropRight(data)}
                onDelete={handleDelete(data)}
                className={classes.chip}
              />
            );
          })}
        </Paper>
      </CTFormRow>

      <CTFormRow>
        <CTAutoComplete
          error={selCoursesError}
          helpText={selCoursesError ? 'Please select at least one course number.' : ''}
          className={classes.row}
          underlined
          disabled={depart === ''}
          id="sel-courses"
          label="Select Courses"
          defaultValue=""
          options={courses}
          value={course}
          onChange={depart === '' ? undefined : onCourseChange}
        />

      </CTFormRow>
    </CTFragment>

  )
}