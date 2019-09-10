/**
 * SearchBar, a sub screen of Home page, shows up when user want to search a course
 */

import React, { useState, useEffect } from 'react'
// UI
import { Icon, List, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import './index.css'
// Vars
import { search, util, user } from 'utils'
import { ClassTranscribeFooter } from 'components'


export function Search({offerings, location}) {
  var defaultValue = location.state ? location.state.value : ''
  const [searchValue, setSearchValue] = useState(defaultValue)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect( () => {
    window.scrollTo(0, 0)
    if (offerings.length) {
      if (defaultValue) {
        setResults(() => search.getResult(offerings, defaultValue))
      }
    }
  }, [offerings])

  if (!offerings.length) return null

  const onInput = ({ target: {value} }) => {
    setSearchValue(() => value)
    // localStorage.setItem('searchValue', value)
    setResults(() => search.getResult(offerings, value))
  }

  return (
    <div className="search-bar" id="search-bar">
      <div className="goback-container">
        <Link className="del-icon" to={util.links.home()} >
          <Icon name="chevron left" /> Back to Courses
        </Link>
      </div>

      <div className="sb-input">
        <div className="ui icon input">
          <input autoFocus
            type="text" className="prompt" id="search"
            value={searchValue}
            onChange={onInput}
            placeholder="Search for Courses ..."
            autoComplete="off"
          />
          <i aria-hidden="true" className="search icon"></i>
        </div>
      </div>

      <div className="result">
        {loading && <p>Loading Results...</p>}
        <List divided relaxed>
          {results.map( (result, index) => (
            <List.Item className="resultItem" key={result.key + index.toString()}>
              <List.Content>
                <h3 className="d-inline">
                  <Link to={{
                    pathname: util.links.offeringDetail(result.key),
                    state: { from: 'search', fullCourse: result, searchedValue: searchValue }
                  }}>{result.fullNumber}</Link>
                </h3>
                <h4>{result.courseName}&ensp;<span>{result.description}</span></h4>
                <p className="text-muted">{result.termName}&ensp;{result.section}</p>
              </List.Content>
            </List.Item>
          ))}
        </List>

        {
          results.length === 0 
          && 
          <div className="search-empty-result">
            {
              user.isLoggedIn() ?
              <span>No Results</span>
              :
              <>
                <span>Can't Find Your Courses?</span>
                <span>Sign In to See More</span>
                <Button compact onClick={() => user.login()}>Sign In</Button>
              </>
            }
          </div>
        }
      </div>
      
      <ClassTranscribeFooter />
    </div>
  )
}