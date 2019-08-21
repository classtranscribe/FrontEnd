/**
 * SearchBar, a sub screen of Home page, shows up when user want to search a course
 */

import React, { createRef, useState, useEffect } from 'react'
// UI
import { Icon, List, Sticky } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import './index.css'
// Vars
import { search, util } from 'utils'
import { ClassTranscribeFooter } from 'components'


export function Search({offerings}) {
  const [searchValue, setSearchValue] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const ref = createRef()

  useEffect( () => {
    if (offerings.length) {
      var defaultValue = util.parseSearchQuery().value
      var isWindowSearch = true
      if (!defaultValue) {
        defaultValue = localStorage.getItem('searchValue')
        isWindowSearch = false
      }
      if (defaultValue) {
        setSearchValue(() => defaultValue )
        if (isWindowSearch) {
          setLoading(true)
          setTimeout(() => {
            setResults(() => search.getResult(offerings, defaultValue))
            setLoading(false)
           }, 3000);
        } else setResults(() => search.getResult(offerings, defaultValue))
      }
    }
  }, [offerings])

  if (!offerings.length) return null

  const onInput = ({ target: {value} }) => {
    setSearchValue(() => value)
    localStorage.setItem('searchValue', value)
    setResults(() => search.getResult(offerings, value))
  }

  return (
    <div className="search-bar" id="search-bar" ref={ref}>
      <div className="goback-container">
        <Link className="del-icon" to={util.links.home()} >
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
              autoComplete="off"
            />
            <i aria-hidden="true" className="search icon"></i>
          </div>
        </div>
      </Sticky>
      <div className="result">
        {loading && <p>Loading Results...</p>}
        <List divided relaxed>
          {results.map( (result, index) => (
            <List.Item className="resultItem" key={result.key + index.toString()}>
              <List.Content>
                <h3 className="d-inline">
                  <Link to={{
                    pathname: util.links.offeringDetail(result.key),
                    state: { from: 'search', fullCourse: result }
                  }}>{result.fullNumber}</Link>
                </h3>
                <h4>{result.courseName}&ensp;<span>{result.description}</span></h4>
                <p>{result.termName}&ensp;{result.section}</p>
              </List.Content>
            </List.Item>
          ))}
        </List>
      </div>
      
      <ClassTranscribeFooter />
    </div>
  )
}