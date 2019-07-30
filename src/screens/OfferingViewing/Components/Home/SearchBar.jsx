/**
 * SearchBar, a sub screen of Home page, shows up when user want to search a course
 */

import React, { createRef } from 'react'
import { Icon, List, Sticky } from 'semantic-ui-react';
import { search } from '../../../../util';
import { Link } from 'react-router-dom'

export default function SearchBar({onSearching, onInput, state, setCurrentOffering}) {
  if (!state.onSearching) return null
  const ref = createRef()
  const { offerings, searchValue } = state
  const results = search.getResult(offerings, searchValue)

  return (
    <div className="search-bar" id="search-bar" ref={ref}>
      <div className="goback-container" onClick={onSearching}>
        <Link className="del-icon">
          <Icon name="chevron left" /> Back to Courses
        </Link>
      </div>

      <Sticky context={ref}>
        <div className="sb-input">
          <div className="ui icon input">
            <input autoFocus
              type="text" className="prompt" id="search"
              value={searchValue}
              onChange={onInput}
              placeholder="Search for Courses ..."
            />
            <i aria-hidden="true" class="search icon"></i>
          </div>
        </div>
      </Sticky>
      
      <div className="result">
        <List divided relaxed>
          {results.map( (result, index) => (
            <List.Item className="resultItem" key={result.key + index.toString()}>
              <List.Content>
                <h3 className="d-inline">
                  <Link onClick={() => setCurrentOffering(result, 'search')}>{result.fullNumber}</Link>
                </h3>
                <h4>{result.courseName}&ensp;<span>{result.description}</span></h4>
                <p>{result.termName}&ensp;{result.section}</p>
              </List.Content>
            </List.Item>
          ))}
        </List>
      </div>

      {/* <div style={{width: '100%', height: '100%'}} onClick={onSearching}></div> */}
    </div>
  )
}