import React from 'react'
import _ from 'lodash'
import { 
  Card      as UICard, 
  Segment   as UISegment,
  Image     as UIImage, 
  Label, Icon, Placeholder, Divider, 
} from 'semantic-ui-react'


function CourseList(props) {
  const courses = props.courses;
  const theme = props.theme;
  const darkMode = theme === '-dark';
  const cardBg = darkMode ? {backgroundColor: 'rgb(40, 40, 40)'} : {};

/* handling the filter tags */ 
  const filters = [
    {name: 'currUni', value: props.currUni}, 
    {name: 'currTerm', value: props.currTerm}, 
    {name: 'currDepart', value: props.currDepart}
  ];
  function All(filter) {return filter.value === 'All'}
  const noFilter = filters.every(All) ? 'none' : '';

/* Function to determine which courses will show on the page */
  let validCourseNum = 0;
  function isValidCourse(course) {
    // need to compare the university
    if((course.term === props.currTerm || props.currTerm === 'All') 
        && (course.subject === props.currDepart || props.currDepart === 'All')) {
          validCourseNum++;
          return true;
        }
    return false;
  }
  const NoValidCourse = () => {
    return (validCourseNum === 0) ? (
      <UISegment 
        inverted={darkMode} padded='very' 
        textAlign='center' 
        style={{width: '100%', marginTop: '3rem'}}
      >
        Please change the filter to see courses.
      </UISegment>
    ) : <></>
  }

  // the placeholder while the content is loading
  const CourseListLoader = () => {
    return (
      _.times( 5, () => 
        <UISegment inverted={darkMode}>
          <Placeholder style={{width: '100%'}} inverted={darkMode}>
            <Placeholder.Header image>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Header>
          </Placeholder>
        </UISegment>
      )
      
    )
  }

  return (
    <>
    <div className={"filter-tags"+theme}>
      <strong>&emsp;<i class="fas fa-filter"></i> Current Filter(s)&emsp;</strong>
      {filters.map( filter => (filter.value === 'All') ?  (<></>) :
        <Label color={darkMode ? "black": ""}>
          {filter.value}<Icon name='delete' onClick={()=>props.setFilter(filter.name, 'All')}/>
        </Label>
      )}
      <p className="d-inline text-muted">{noFilter}</p>
    </div>
{/* determine whether the content is loading */}
    { ( props.loading ) ? <CourseListLoader /> :
      <UICard.Group>
{/* determine whether the course is valid to show */}
        {courses.map( course => isValidCourse(course) ? 
          <UISegment as={UICard} 
            style={cardBg} fluid={!props.gridMode} 
            className={"sp-course-card"+theme} 
            href={window.location} 
            onClick={() => alert(`Videos of ${course.num} at ${course.term}`)}
          >
            <UICard.Content>
            <UIImage floated='right' size='mini' src={require('../../images/uiuc-logo.png')} />
              <UICard.Header>
                <h1>{course.num}&ensp;<i class="fas fa-film"></i></h1>
              </UICard.Header>
              <UICard.Meta><h5>{course.name}</h5></UICard.Meta>
              <p><Divider /><strong><strong>Section:</strong> {course.sec}<br/>Instructor: </strong>{course.instructor}</p>
              <UICard.Description><p>{course.description}</p></UICard.Description>
            </UICard.Content>
          </UISegment> : <></>
        )}
{/* determine whether the content is empty */}
        <NoValidCourse />
      </UICard.Group> 
    }
    </>
  )
}

export default CourseList;
