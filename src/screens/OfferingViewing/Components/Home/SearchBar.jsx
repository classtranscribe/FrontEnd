import React from 'react'
import { Search, Icon, List } from 'semantic-ui-react';
import { search } from '../../../../util';
import { Link } from 'react-router-dom'

export default function SearchBar({onSearching, onInput, state}) {
  const { offerings, searchValue } = state
  const results = search.getResult(offerings, searchValue)
  return (
    <div className="search-bar" id="search-bar">
      {/* <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <Icon name="remove" color="grey" style={{cursor: 'pointer'}} size="large" />
      </div> */}

      <div className="sb-input">
        <div className="ui icon input">
          <input 
            type="text" className="prompt" id="search"
            value={searchValue}
            onChange={onInput}
            onBlur={onSearching}
            placeholder="Search for Courses ..."
          />
          <i aria-hidden="true" class="search icon"></i>
        </div>
      </div>
      
      <div className="result">
        <List divided relaxed>
        {results.map( (result, index) => (
          <List.Item className="resultItem" key={result.key + index.toString()}>
            <List.Content>
              <h3 className="d-inline">
                <Link >{result.number}</Link>
              </h3>
              <h4>{result.name}&ensp;<span>{result.description}</span></h4>
              <p>{result.term}&ensp;{result.section}</p>
            </List.Content>
          </List.Item>
        ))}
        </List>
      </div>

      {/* <div style={{width: '100%', height: '100%'}} onClick={onSearching}></div> */}
    </div>
  )
}