/**
 * Pane for Universities of Admin Page
 */

import React from 'react'
import { Route } from 'react-router-dom'
import authentication from 'react-azure-adb2c'
// UI
import EditUniPage from './edit-uni'
import { CreateNewButton, AdminListItem } from '../admin-components'
import { Tab, Divider } from 'semantic-ui-react'

export default function UniPane({state: {universities, uniLoading}}) {
  return (
    <Tab.Pane attached={false} className="ap-list" loading={uniLoading}>
      <Route path='/admin/uni/:type?=:id' component={authentication.required(EditUniPage)}/>      
      <CreateNewButton name='Create New University' path='uni'/>
      <Divider horizontal>All Universities</Divider>
      {universities.slice().reverse().map( university => (
          <AdminListItem 
            header={university.name} 
            path={'uni'}
            id={university.id}
            items={[
              `Domain: ${university.domain}`
            ]}
          />
      ))}
    </Tab.Pane>
  )
}