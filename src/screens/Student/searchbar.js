import React from 'react'
import _ from 'lodash'
import { Search as UISearch, Icon, } from 'semantic-ui-react'
import { Row, Button, ButtonGroup } from 'react-bootstrap'

function SearchBar(props) {
  const darkMode = props.darkMode;
  const gridMode = props.gridMode;
   
  return (
    <Row className="search-bar">
      <UISearch
        fluid input={{placeholder: 'Search for courses here ...'}}
        onSearchChange={_.debounce(props.onSearchChange, 500, {eading: true,})}
        {...props}
      />
      <ButtonGroup>
      <Button 
        className="theme-btn" 
        onClick={props.setDarkMode} 
        variant={darkMode ? "outline-light" : "outline-dark"}
      >
        &ensp;{darkMode ? <Icon name="lightbulb outline"/> : <Icon name="moon"/>}
      </Button>
      <Button 
        className="theme-btn" 
        onClick={props.setGridMode} 
        variant={darkMode ? "outline-light" : "outline-dark"}
      >
        &ensp;{gridMode ? <Icon name="list layout"/> : <Icon name="block layout"/>}
      </Button>
      </ButtonGroup>
    </Row>
  )
}

export default SearchBar;