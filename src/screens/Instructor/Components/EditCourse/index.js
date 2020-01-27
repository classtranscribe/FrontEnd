import React, { useState, useEffect } from 'react'
import { connectWithRedux } from '_redux/instructor'
import { withRouter } from 'react-router'
import { CTButton } from 'components'
import {
  CourseSelection,
  BasicInfo,
  Students,
  Staffs,
} from './Forms'
import './index.css'
import { setup, offControl, NEW_OFFERING, NO_OFFERING } from '../../Utils'

function EditCourseWithRedux({
  newCourse=false,
  offering={},

  isEditingOffering=false,
  setIsEditingOffering,
}) {

  const [addStudents, setAddStudents] = useState(false)
  const [instructors, setInstructors] = useState([])
  const [errors, setErrors] = useState([]) // { name, mesg }
  const onClose = () => setIsEditingOffering(false)

  useEffect(() => {
    if (isEditingOffering) {
      setup.getInstructorsByOfferingId(offering.id, insts => {
        setInstructors(insts.instructors)
        offControl.instructors(insts)
      })
    }
  }, [isEditingOffering])

  useEffect(() => {
    if (offering === NEW_OFFERING) {
      if (instructors.length > 0) setInstructors([])
      if (addStudents) setAddStudents(false)
    }
  }, [offering])

  const is1sOffering = setup.offerings() === NO_OFFERING

  return (
    <div className="ip-edit-c ct-a-fade-in">
      <div className="ip-edit-c-con">
        {/* Back Button */}
        {
          !newCourse
          &&
          <div className="w-auto">
            <button 
              className="plain-btn ip-sb-off-item ip-c-pl-item p-0 w-auto" 
              onClick={onClose}
            >
              <div tabIndex="-1" className="ip-sb-off-item-con ip-c-pl-item-con">
                <span className="ct-d-r-center-v ip-sb-off-text ip-c-pl-name ip-sb-off-num ip-f-back-btn">
                  <i className="material-icons" aria-hidden="true">chevron_left</i> Cancel
                </span>
              </div>
            </button>
          </div>
        }

        {/* Title */}
        <h2>{is1sOffering ? 'Create your first offering' : newCourse ? 'New Offering' : 'Edit Offering'}</h2>

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
              />
            }
            <Staffs 
              errors={errors} 
              setErrors={setErrors} 
              instructors={instructors} 
            />

            <div className="ct-d-r-center-v w-100 m-3 ip-f-btn-group ct-btn-group">
              <CTButton
                color="green"
                text="Save"
                size="big"
                //type="submit"
                onClick={() => offControl.save(newCourse, setErrors)}
              />
              {
                !newCourse
                &&
                <CTButton
                  size="big bold"
                  color="text-green"
                  text="Cancel"
                  onClick={onClose}
                />
              }
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
          </form>
        </div>
      </div>
    </div>
  )
}

export const EditCourse = withRouter(connectWithRedux(
  EditCourseWithRedux,
  ['offering', 'isEditingOffering'],
  [
    'setOffering',
    'setIsEditingOffering'
  ]
))