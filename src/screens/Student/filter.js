import React from 'react'
import { Accordion as UIAccordion, Card as UICard, Segment as UISegment, Placeholder } from 'semantic-ui-react'
import { Card, ListGroup, Button } from 'react-bootstrap'

function Filter(props) {
  const theme = props.theme;
  const darkMode = theme === '-dark';

  const contentList = (list, filter) => {
    const handeSelect = e => props.setFilter(filter, list[e.target.value]);
    return (
      <ListGroup variant="flush" className={list}>
        {list.map( (item, index) => (
          <ListGroup.Item 
            value={index} eventKey={index}
            action variant={darkMode ? 'dark':'light'} 
            onClick={handeSelect}
          >{item}</ListGroup.Item>
        ))}
      </ListGroup>
    )
  }

  // the placeholder while the content is loading
  const FilterLoader = () => {
    return (
      <UISegment inverted={darkMode}>
        <Placeholder inverted={darkMode}>
          <Placeholder.Header >
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line length='medium'/>
          </Placeholder.Header>
          <Placeholder.Paragraph>
            <Placeholder.Line length='medium' />
            <Placeholder.Line length='short' />
          </Placeholder.Paragraph>
        </Placeholder>
      </UISegment>
    )
  }

  return (
    <div className={"sp-filter"} >
    {( !props.loading ) ? 
      <UIAccordion as={UICard} fluid inverted={darkMode} >
        <Card.Header 
          as={Button} 
          variant={darkMode ? 'secondary' : 'light'} 
          className={"reset-filter-btn"+theme}
          onClick={()=>props.setFilter('reset')}
        >Clear Filters</Card.Header>
        
        <Card.Header className={"filter"+theme}>
          <UIAccordion.Title
            active={props.showUniFilter}
            content='Filter by University'
            onClick={props.onFilteringUni}
          />
          <UIAccordion.Content 
            active={props.showUniFilter} 
            content={contentList(props.universities, 'currUni')}
          />
        </Card.Header>

        <Card.Header className={"filter"+theme} style={{border: '0'}}>
          <UIAccordion.Title
            active={props.showTermFilter}
            content='Filter by Term'
            onClick={props.onFilteringTerm}
          />
          <UIAccordion.Content 
            active={props.showTermFilter} 
            content={contentList(props.terms, 'currTerm')} 
          />
        </Card.Header>
        
        <Card.Footer className={"filter"+theme}>
          <UIAccordion.Title
            active={props.showDepartFilter}
            content='Filter by Department'
            onClick={props.onFilteringDepart}
          />
          <UIAccordion.Content 
            active={props.showDepartFilter} 
            content={contentList(props.departments, 'currDepart')} 
          />
        </Card.Footer> 
      </UIAccordion> : <FilterLoader />}
    </div> 
  )
}

export default Filter;