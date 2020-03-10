/**
 * Pane for Universities of Admin Page
 */

import React from 'react'
import { Route } from 'react-router-dom'
// UI
import UniversityEditing from './UniversityEditing'
import { CreateNewButton, AdminListItem } from '../Components'
import { Tab, Divider } from 'semantic-ui-react'

export default function UniPane({state: { universities }}) {
  return (
    <Tab.Pane attached={false} className="ap-list">
      <Route path='/admin/uni/:type?=:id' component={UniversityEditing}/>      
      <CreateNewButton name='Create New University' id='new' path='uni'/>
      <Divider horizontal>All Universities</Divider>
      {(universities.slice() || []).reverse().map( university => (
          <AdminListItem 
            header={university.name} 
            path={'uni'}
            id={university.id}
            key={university.id}
            items={[
              `Domain: ${university.domain}`
            ]}
          />
      ))}
    </Tab.Pane>
  )
}