/**
 * SearchBar, a sub screen of Home page, shows up when user want to search a course
 */

import React, { useState, useEffect } from 'react'
// UI
import { Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { ClassTranscribeFooter } from '../../../../components'
import SearchInput from './SearchInput'
import SearchResult from './SearchResult'
import './index.css'
// Vars
import { search, util } from '../../../../utils'

export function Search({offerings, location}) {
  var defaultValue = location.state ? location.state.value : ''
  const [searchValue, setSearchValue] = useState(defaultValue)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect( () => {
    util.scrollToTop('.sp-content')
    util.links.title('Search')
    window.scrollTo(0, 0)
    if (offerings.length) {
      if (defaultValue) {
        setResults(search.searchInOfferings(offerings, defaultValue))
      }
    }
  }, [offerings])

  if (!offerings.length) return null

  const onInput = ({ target: {value} }) => {
    setSearchValue(value)
    // localStorage.setItem('searchValue', value)
    setResults(search.searchInOfferings(offerings, value))
  }

  return (
    <div className="search-bar ct-a-fade-in" id="search-bar">
      <h1 className="accessbility_hide">Search</h1>
      <div className="goback-container">
        <Link className="del-icon" to={util.links.home()} >
          <Icon name="chevron left" /> Back to Courses
        </Link>
      </div>

      <SearchInput searchValue={searchValue} onInput={onInput} />

      <SearchResult loading={loading} results={results} searchValue={searchValue} />
      
      <ClassTranscribeFooter />
    </div>
  )
}