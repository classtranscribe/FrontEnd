import React, { useState, useEffect } from 'react'
import { Button } from 'pico-ui'
import {
  CourseSelection,
  BasicInfo,
  Students,
  Staffs,
} from './Forms'
import './index.css'
import { 
  connectWithRedux, 
  setup, 
  offControl, 
  NEW_OFFERING, 
} from '../../Utils'

function EditCourseWithRedux({
  newCourse=false,
  offering={},

  isEditingOffering=false,
  setIsEditingOffering,
}) {

  const [addStudents, setAddStudents] = useState(false)
  const [instructors, setInstructors] = useState([])
  const [students, setStudents] = useState([])
  const [errors, setErrors] = useState([]) // { name, mesg }
  const onClose = () => setIsEditingOffering(false)

  useEffect(() => {
    if (isEditingOffering) {
      setup.getLinkedUsersByOfferingId(offering.id, users => {
        setInstructors(users.instructors)
        setStudents(users.students)
        offControl.instructors(users)
        offControl.students(users)
      })
    }
  }, [isEditingOffering])

  useEffect(() => {
    if (offering === NEW_OFFERING) {
      if (instructors.length > 0) setInstructors([])
      if (addStudents) setAddStudents(false)
    }
  }, [offering])

  const is1sOffering = setup.offerings().length === 0

  return (
    <div className="ip-edit-c ct-a-fade-in">
      <div className="ip-edit-c-con">
        {/* Back Button */}
        {
          !newCourse
          &&
          <button 
            className="plain-btn ip-goback" 
            onClick={onClose}
          >
            <span tabIndex="-1">
              <i className="material-icons" aria-hidden="true">chevron_left</i> GO BACK
            </span>
          </button>
        }

        {/* Title */}
        <h2 className="ip-title">
          {
            is1sOffering 
            ? 
            'Welcome, Create your first offering!' 
            : 
            newCourse 
            ? 
            'New Offering' 
            : 
            'Course Settings'
          }
        </h2>

        <div className="ip-f-form-con">
          <form className="w-100">
            <CourseSelection 
              errors={errors} 
              setErrors={setErrors} 
            />
            <BasicInfo 
              errors={errors} 
              setErrors={setErrors} 
              setAddStudents={setAddStudents} 
            />
            {
              addStudents 
              && 
              <Students 
                errors={errors} 
                setErrors={setErrors} 
                students={students}
              />
            }
            <Staffs 
              errors={errors} 
              setErrors={setErrors} 
              instructors={instructors} 
            />
          </form>

          <div className="ct-d-r-center-v w-100 m-3 ip-f-btn-group ct-btn-group">
              <Button.Group>
                <Button uppercase
                  color="teal"
                  text={isEditingOffering ? "save course" : "create course"}
                  //type="submit"
                  onClick={() => offControl.save(newCourse, setErrors)}
                />
                {
                  !newCourse
                  &&
                  <Button uppercase
                    color="teal transparent"
                    text="Cancel"
                    onClick={onClose}
                  />
                }
              </Button.Group>
            </div>

            {
              errors.length > 0
              &&
              <div className="d-flex flex-row justify-content-end">
                <div className="ip-f-courses-error">
                  Please fix the errors above before saving.
                </div>
              </div>
            }
        </div>
      </div>
    </div>
  )
}

export const EditCourse = connectWithRedux(
  EditCourseWithRedux,
  ['offering', 'isEditingOffering'],
  [
    'setOffering',
    'setIsEditingOffering'
  ]
)

export const NewCourse = () => <EditCourse newCourse />