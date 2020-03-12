import React from 'react'
// UI
import { List, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { util, user } from '../../../../utils'

function SearchResult({ loading, results, searchValue }) {
  return (
    <div className="result">
      {loading && <p>Loading Results...</p>}
      <List role="list" divided relaxed>
        {results.map( (result, index) => (
          <List.Item className="resultItem" key={result.id + index}>
            <List.Content>
              <p className="d-inline offering-num">
                <Link to={{
                  pathname: util.links.offeringDetail(result.id),
                  state: { from: 'search', offering: result, searchedValue: searchValue }
                }}>{result.fullNumber}</Link>
              </p>
              <p className="offering-name">{result.courseName}&ensp;<span>{result.description}</span></p>
              <p className="text-muted">{result.termName}&ensp;{result.sectionName}</p>
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
              <Button compact onClick={() => user.signin()}>Sign In</Button>
            </>
          }
        </div>
      }
    </div>
  )
}

export default SearchResult