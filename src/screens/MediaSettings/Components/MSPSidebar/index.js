import React from 'react'
// import { connectWithRedux } from '../../Utils'
import { ListItem } from '../../../Instructor/Components/ListItem'
import './index.scss'

export function MSPSidebar({
  id,
  children,
  width=200,
}) {

  return (
    <div id={id} className="msp-sidebar" data-width={width}>
      <div className="msp-sb-con" data-scroll>
        {children}
      </div>
    </div>
  )
}

MSPSidebar.Item = ListItem