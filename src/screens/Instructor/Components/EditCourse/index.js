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
import { setup, offControl, NEW_OFFERING } from '../../Utils'

function EditCourseWithRedux({
  newCourse=false,
  offering={},

  isEditingOffering=false,
  setIsEditingOffering,
}) {

  const [addStudents, setAddStudents] = useState(false)
  const [instructors, setInstructors] = useState([])
  const onClose = () => setIsEditingOffering(false)

  useEffect(() => {
    if (isEditingOffering) {
      setup.getInstructorsByOfferingId(offering.id, insts => {
        setInstructors(insts)
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


  return (
    <div className="ip-edit-c-con ct-a-fade-in">
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
      <h2>{newCourse ? 'New Offering' : 'Edit Offering'}</h2>

      <div className="ip-f-form-con">
        <form className="w-100">
          <CourseSelection />
          <BasicInfo setAddStudents={setAddStudents} />
          {addStudents && <Students />}
          <Staffs instructors={instructors} />

          <div className="ct-d-r-center-v w-100 mt-3 ip-f-btn-group ct-btn-group">
            <CTButton
              icon="check"
              color="green"
              text="Save"
              size="big"
              onClick={() => offControl.save(newCourse)}
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
        </form>
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