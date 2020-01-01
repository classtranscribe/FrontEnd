import _ from 'lodash'
import React, { useState, useEffect } from 'react'
import { connectWithRedux } from '_redux/instructor'
import { CTForm } from 'components'
import { Grid, Form, Select, Popup, Icon, Label, Message, Divider } from 'semantic-ui-react'
import { api } from 'utils'

function CourseSelectionWithRedux({
  departments=[],
}) {

  const [depart, setDepart] = useState('')
  const [term, setTerm] = useState('')
  const [courses, setCourses] = useState([])
  const [selCourses, setSelCourses] = useState([])

  const onTermChange = value => {
    setTerm(value)
  }

  const onDepartChange = value => {
    setDepart(value)
  }

  const addCourse = id => {
    let course_ = _.find(courses, { id })
    let includes = _.includes(selCourses, course_)
    if (course_ && !includes) {
      setSelCourses([ ...selCourses, course_ ])
    }
  }

  const removeCourse = id => {
    _.remove(selCourses, { id })
    setSelCourses([ ...selCourses ])
  }

  useEffect(() => {
    if (Boolean(depart)) {
      api.getCoursesByDepartId(depart)
        .then(({ data }) => {
          console.log('courses', data, depart)
          let dep = _.find( departments, { id: depart })
          setCourses(
            _.map( data, co => ({ ...co, acronym: dep.acronym }) )
          )
        })
    }
  }, [depart])

  const fullNumber = api.getFullNumber(selCourses)

  return (
    <div className="ip-f-section">
      <div className="ip-f-title">
        <h3>Select Courses</h3>
      </div>

      <Grid columns='equal' stackable className="ip-f-grid">
        <Grid.Row>
          <Grid.Column>
            <CTForm search
              label="Select a Department"
              color="grey"
              placeholder="Filter Departments"
              onChange={onDepartChange}
              options={CTForm.getOptions(departments, 'id', 'name')}
            />
          </Grid.Column>

          {
            Boolean(depart)
            &&
            <Grid.Column></Grid.Column>
          }
        </Grid.Row>

        {
          Boolean(courses.length > 0)
          &&
          <Grid.Row className="ct-a-fade-in">
            <Grid.Column>
              <CTForm search
                label="Select Courses"
                color="grey"
                placeholder="Filter Courses"
                onChange={addCourse}
                options={CTForm.getOptions(courses, 'id', ['acronym','courseNumber'])}
              />
            </Grid.Column>

            <Grid.Column>
              <div className="w-100 ip-f-seled-course-con">
                <div className="ip-f-seled-course-title">
                  Selected Courses
                  <span>{fullNumber}</span>
                </div>
                {
                  selCourses.length === 0
                  &&
                  <div className="ip-f-dtext mt-4">
                    Your selected courses will show here
                  </div>
                }
                <div className="ct-d-r-center-v ip-f-seled-courses">
                  <Label.Group size="large" role="group">
                    {selCourses.map( selc => (
                      <Label key={selc.id} color="grey">
                        {selc.acronym}{selc.courseNumber}
                        <Icon 
                          name="delete" 
                          onClick={()=>removeCourse(selc.id)} 
                          title="remove" aria-label="remove" 
                        />
                      </Label>
                    ))}
                  </Label.Group>
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>
        }
      </Grid>
    </div>
  )
}

export const CourseSelection = connectWithRedux(
  CourseSelectionWithRedux,
  ['departments'],
  []
)