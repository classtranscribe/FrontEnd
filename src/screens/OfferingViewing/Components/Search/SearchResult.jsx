import React from 'react'
// UI
import { List, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { util, user } from 'utils'

function SearchResult({ loading, results, searchValue }) {
  return (
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
  )
}

export default SearchResult