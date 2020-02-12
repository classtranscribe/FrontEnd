import React from 'react'
import { Link } from 'react-router-dom'
import { NEW_OFFERING_ID } from '../../Utils'
import { util } from '../../../../utils'

export default function NoOfferingHolder() {
  return (
    <div className="ip-nf-holder">
      Create your first offering 
      <Link to={util.links.instOffering(NEW_OFFERING_ID)}>here</Link>
    </div>
  )
}
