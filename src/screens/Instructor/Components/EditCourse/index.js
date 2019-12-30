import React, { useEffect, useState } from 'react'
import { connectWithRedux } from '_redux/instructor'
import { withRouter } from 'react-router'
import { CTButton } from 'components'
import './index.css'

function EditCourseWithRedux({
  newCourse=false,
}) {

  return (
    <div className="ip-edit-c-con">
      <h2>{newCourse ? 'New Offering' : 'Edit Offering'}</h2>
    </div>
  )
}

export const EditCourse = withRouter(connectWithRedux(
  EditCourseWithRedux,
  [],
  []
))