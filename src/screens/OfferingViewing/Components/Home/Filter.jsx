/**
 * Filter component 
 * - filter by university, terms, departments
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { Dropdown, Form, Grid } from 'semantic-ui-react'
import { util } from 'utils'

export default function Filter({state, onUniSelected, onDepartSelected, onTermSelected}) {
  const { universities, departments, terms, uniSelected } = state

  // get selecting options
  const uniOptions = util.getSelectOptions(universities)
  const termOptions = util.getSelectOptions(terms, 'term')
  const departOptions = util.getSelectOptions(departments, 'depart')

  const termStyle = terms.length ? {} : {display: 'none'}
  return (
    <div className="filter">
      <Form>
        <Grid stackable columns="equal">
          <Grid.Row className="search-bar">
            <Grid.Column >
              <div className="ui icon input" style={{width: '100%'}} >
                <Link to={util.links.search()} style={{width: '100%'}} >
                <input 
                  type="text" className="prompt" readOnly
                  value={localStorage.getItem('searchValue') || ''}
                  placeholder="Search for Courses ..."
                />
                </Link>
                <i aria-hidden="true" className="search icon"></i>
              </div>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Form.Field 
                control={Dropdown}
                placeholder="Select University"
                label="Filter by University"
                clearable selection search
                value={uniSelected}
                options={uniOptions}
                onChange={onUniSelected}
              />
            </Grid.Column>

            <Grid.Column>
              <Form.Field 
                control={Dropdown}
                placeholder="Select Departments"
                label="Filter by Departments"
                clearable selection multiple search
                options={departOptions}
                onChange={onDepartSelected}
              />
            </Grid.Column>

            <Grid.Column style={termStyle}>
              <Form.Field 
                control={Dropdown}
                placeholder="Select Terms"
                label="Filter by Terms"
                clearable selection multiple search
                options={termOptions}
                onChange={onTermSelected}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    </div>
  )
}