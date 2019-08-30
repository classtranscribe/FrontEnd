/**
 * Filter component 
 * - filter by university, terms, departments
 */

import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { Dropdown, Form, Grid } from 'semantic-ui-react'
import { util } from 'utils'

function Filter({state, onUniSelected, onDepartSelected, onTermSelected, displaySearchHeader, history}) {
  const { universities, departments, terms, uniSelected } = state

  // get selecting options
  const uniOptions = util.getSelectOptions(universities)
  const termOptions = util.getSelectOptions(terms.slice().reverse(), 'term')
  const departOptions = util.getSelectOptions(departments, 'depart')

  const [searchValue, setSearchValue] = useState('')
  const handleOnKeyDown = e => {
    if (e.keyCode === 13) {
      setSearchValue('')
      history.push(util.links.search(), { value: searchValue })
    }
  }

  const termStyle = terms.length ? {} : {display: 'none'}
  return (
    <div className="filter">
      <Form>
        <Grid stackable columns="equal">
          {
            !displaySearchHeader
            &&
            <Grid.Row className="search-bar">
              <Grid.Column id="filter-search">
                <div className="ui icon input" style={{width: '100%'}} >
                  <input 
                    type="text" className="prompt"
                    value={searchValue}
                    onChange={({target: {value}}) => setSearchValue(value)}
                    placeholder="Search for Courses ..."
                    onKeyDown={handleOnKeyDown}
                  />
                  <i aria-hidden="true" className="search icon"></i>
                </div>
              </Grid.Column>
            </Grid.Row>
          }

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

export default withRouter(Filter)