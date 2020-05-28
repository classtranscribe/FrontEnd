import React from 'react';
import { List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { SignInPrompt } from 'components';
import { util, user } from 'utils';

function SearchResult({ loading, results, searchValue }) {
  return (
    <div className="result">
      {loading && <p>Loading Results...</p>}
      <List role="list" divided relaxed>
        {results.map((result, index) => (
          <List.Item className="resultItem" key={result.id + index}>
            <List.Content>
              <p className="d-inline offering-num">
                <Link
                  to={{
                    pathname: util.links.offeringDetail(result.id),
                    state: { from: 'search', offering: result, searchedValue: searchValue },
                  }}
                >
                  {result.fullNumber}
                </Link>
              </p>
              <p className="offering-name">{result.courseName}</p>
              <p className="offering-description">{result.description}</p>
              <p className="offering-section">
                {result.termName} | {result.sectionName}
              </p>
            </List.Content>
          </List.Item>
        ))}
      </List>

      {results.length === 0 && (
        <div className="search-empty-result">
          {user.isLoggedIn ? (
            <div>No Results</div>
          ) : (
            <SignInPrompt
              topDescription={
                <>Can&#39;t find your courses? <br />Sign in to see more.</>
              }
            />
          )}
        </div>
      )}
    </div>
  );
}

export default SearchResult;
