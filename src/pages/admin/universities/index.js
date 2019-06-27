import React from 'react'
import {Route} from 'react-router-dom'
import EditUniPage from './edit-uni'
import { CreateNewButton, AdminListItem } from '../admin-components'
import { Tab, Divider } from 'semantic-ui-react'

export default function UniPane(props) {
  const universities = props.state.universities;
  
  return (
    <Tab.Pane attached={false} className="ap-list">
      <Route path={'/admin/uni/:id'} component={EditUniPage}/>      
      <CreateNewButton name='Create New University' path='uni'/>
      <Divider horizontal>All Universities</Divider>
      {universities.slice().reverse().map( university => (
        <AdminListItem 
          header={university.name} 
          path={'uni'}
          id={university.id}
          items={[
            `Domain: ${university.domain}`
          ]}/>
      ))}
    </Tab.Pane>
  )
}