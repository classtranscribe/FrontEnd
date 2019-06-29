import React from 'react';
// UIs
import { 
  Form as UIForm, 
  Modal as UIModal, 
  Button as UIButton, 
  Input as UIInput, 
  Select as UISelect,
  TextArea as UITextArea,
  Divider, 
} from 'semantic-ui-react'
// Vars
import { fakeData } from '../data';


export function GeneralModal(props) {
  return (
    <UIModal 
      className="general-modal" style={{position: 'relative'}} 
      size={props.size || 'small'} dimmer='blurring'
      open={props.open} onClose={props.onClose}
    >
      <UIModal.Header>{props.header}</UIModal.Header>
      {
        props.children && 
        <UIModal.Content image>
          {props.children}
        </UIModal.Content>
      }
      <UIModal.Actions>
        {props.button}
      </UIModal.Actions>
    </UIModal>
  )
}

export function DeleteModal(props) {
  return (
    <UIModal 
      className="course-modal" style={{position: 'relative'}} 
      size="tiny" dimmer='blurring'
      open={props.open} onClose={props.onClose}
    >
      <UIModal.Header>Are You Sure to delete the 
        <strong className="del-target"> {props.target}</strong>?<br/>
        (This action cannot be undone)
      </UIModal.Header>
      <UIModal.Actions>
        <UIButton color='black' onClick={props.onClose}>Cancel</UIButton>
        <UIButton
          negative
          icon='trash'
          labelPosition='right'
          content="Delete Forever"
          onClick={props.onSave}
        />
      </UIModal.Actions>
    </UIModal>
  )
}


/********************************************************* trashes */

/**
 * @param array - terms, departments
 */
function getSelectOption(array, opt1, opt2) {
  const res = [];
  array.forEach( (item, index) => {
    if (opt1 === 'offering') item = opt2 + ' ' + item.term + ' ' + item.sec;
    else if (opt1 === 'offering2') item = item.term + ' ' + item.sec;
    else if (opt1 === 'playlist') item = item.name;
    if (item !== 'All') res.push({
      key: index, text: item, value: item//index
    });
  })
  return res;
}

export function CourseFormModal(props) {
  // if (props.course) console.log(props.course)
  const course = props.course ? props.course : {num: '', name: '', depart: '', uni: 'UIUC', description: ''}
  const departOptions = getSelectOption(fakeData.departments);
  const onChange = props.onChange;
  return (
    <UIModal 
      className="course-modal" style={{position: 'relative'}} 
      size="small" dimmer='blurring'
      open={props.open} onClose={()=>props.onClose(props.info)}
    >
      <UIModal.Header>Course Information</UIModal.Header>
      <UIModal.Content image>
        <UIForm style={{width: '100%'}}>
          <UIForm.Group widths='equal'>
            <UIForm.Field 
              required control={UIInput} defaultValue={course.num}
              label='Course Num' placeholder='E.g. CS241'
              onChange={event=>onChange(event, 'courseInfo', 'num')}
            />
            <UIForm.Field 
              required control={UIInput} defaultValue={course.name}
              label='Course Name' placeholder='E.g. System Programming'
              onChange={event=>onChange(event, 'courseInfo', 'name')}
            />
          </UIForm.Group>
          <UIForm.Group widths='equal'>
            <UIForm.Field required 
              control={UISelect} label='University' 
              defaultActiveKey={0} defaultValue='UIUC' 
              options={[{key: 0, text: 'UIUC', value: 'UIUC'}]}
            />
            <UIForm.Field 
              required control={UISelect} defaultValue={course.depart}
              label='Department' options={departOptions}
              onChange={(event, data)=>onChange(data, 'courseInfo', 'depart')}
            />
          </UIForm.Group>
          <UIForm.Field 
            control={UITextArea} defaultValue={course.description}
            label='Course Description (optional)' 
            placeholder='Course Description' 
            onChange={event=>onChange(event, 'courseInfo', 'description')}
          />
        </UIForm>
      </UIModal.Content>
      <UIModal.Actions>
        <UIButton color='black' onClick={()=>props.onClose(props.info)}>Cancel</UIButton>
        <UIButton
          positive
          icon='checkmark'
          labelPosition='right'
          content="Save"
          onClick={()=>props.onSave('courseInfo')}
        />
      </UIModal.Actions>
    </UIModal>
  )
}

export function OfferingFormModal(props) {
  const offering = props.offering ? props.offering : {term: '', sec: ''};
  const onChange = props.onChange;
  const course = props.course;
  const termOptions = getSelectOption(fakeData.terms);
  const offeringOptions = (course) ? getSelectOption(course.offerings, 'offering', course.num) : [];
  return (
    <UIModal 
      className="course-modal" style={{position: 'relative'}} 
      size="small" dimmer='blurring'
      open={props.open} onClose={()=>props.onClose('offeringInfo')}
    >
      <UIModal.Header>Offering Information</UIModal.Header>
      <UIModal.Content image>
        <UIForm style={{width: '100%'}}>
          <UIForm.Group widths='equal'>
            <UIForm.Field required 
              control={UISelect} label='Term' 
              defaultActiveKey={0} defaultValue={offering.term} 
              options={termOptions}
              onChange={(event, data)=>onChange(data, 'offeringInfo', 'term')}
            />
            <UIForm.Field 
              required control={UIInput} defaultValue={offering.sec}
              label='Section' 
              onChange={(event)=>onChange(event, 'offeringInfo', 'sec')}
            />
          </UIForm.Group>
          { course ? 
            <>
              <Divider horizontal >what's more</Divider>
              <h5 className="pl-modal-text">
                You can set up your offering by duplicating another offering in {props.course.num}
              </h5>
              <UIForm.Field  
                control={UISelect} label='Copy Playlists From ...' 
                defaultActiveKey={1} defaultValue={offering.term} 
                options={offeringOptions}
                onChange={(event, data)=>onChange(data, 'offeringInfo', 'copy')}
              />
            </> : <></>
          }
        </UIForm>
      </UIModal.Content>
      <UIModal.Actions>
        <UIButton color='black' onClick={()=>props.onClose('offeringInfo')}>Cancel</UIButton>
        <UIButton
          positive
          icon='checkmark'
          labelPosition='right'
          content="Save"
          onClick={()=>props.onSave('offeringInfo')}
        />
      </UIModal.Actions>
    </UIModal>
  )
}

export function PlaylistFormModal(props) {
  const course = props.course;
  const offering = props.offering;
  const playlists = props.playlists;
  const playlist = props.playlist || {name: ''};
  const offeringOptions = (course) ? getSelectOption(course.offerings, 'offering2') : [];
  const playlistOptions = (playlists) ? getSelectOption(playlists, 'playlist') : [];
  return (
    <UIModal 
      className="course-modal" style={{position: 'relative'}} 
      size="small" dimmer='blurring'
      open={props.open} onClose={()=>props.onClose(props.info)}
    >
      <UIModal.Header>Playlist Information</UIModal.Header>
      <UIModal.Content image>
        <UIForm style={{width: '100%'}}>
          <UIForm.Group widths='equal'>
            <UIForm.Field 
              required control={UIInput} defaultValue={playlist.name}
              label='Playlist Name' 
              onChange={(event)=>props.onChange(event, 'playlistInfo', 'name')}
            />
          </UIForm.Group> 
          { props.playlist ? <></> :
            <><Divider horizontal >what's more</Divider>
            <h5 className="pl-modal-text">
              You can set up your playlist by copying from another offering in {course.num}
            </h5>
            <UIForm.Group widths='equal'>
              <UIForm.Field  
                control={UISelect} label={`Copy playlist from Offering (${course.num})`} 
                defaultActiveKey={0} defaultValue={offering.term + ' ' + offering.sec} 
                options={offeringOptions}
                onChange={(event, data)=>props.onChange(data, 'playlistInfo', 'copyOffering')}
              />
              <UIForm.Field  
                control={UISelect} label='Copy from Playlist ...' 
                defaultActiveKey={0}
                options={playlistOptions}
                onChange={(event, data)=>props.onChange(data, 'playlistInfo', 'copyPlaylist')}
              />
            </UIForm.Group></>
          }
        </UIForm>
      </UIModal.Content>
      <UIModal.Actions>
        <UIButton color='black' onClick={()=>props.onClose(props.info)}>Cancel</UIButton>
        <UIButton
          positive
          icon='checkmark'
          labelPosition='right'
          content="Save"
          onClick={()=>props.onSave(props.info)}
        />
      </UIModal.Actions>
    </UIModal>
  )
}

export function VideoFormModal(props) {
  return (
    <UIModal 
      className="course-modal" style={{position: 'relative'}} 
      size="mini" dimmer='blurring'
      open={props.open} onClose={()=>props.onClose(props.info)}
    >
      <UIModal.Header>Video Details</UIModal.Header>
      <UIModal.Content image>
        <UIForm style={{width: '100%'}}>
          <UIForm.Group widths='equal'>
            <UIForm.Field 
              required control={UIInput} defaultValue={props.video}
              label='Video Name' 
              onChange={(event)=>props.onChange(event, 'videoInfo', 'name')}
            />
          </UIForm.Group>
        </UIForm>
      </UIModal.Content>
      <UIModal.Actions>
        <UIButton color='black' onClick={()=>props.onClose(props.info)}>Cancel</UIButton>
        <UIButton
          positive
          icon='checkmark'
          labelPosition='right'
          content="Save"
          onClick={()=>props.onSave(props.info)}
        />
      </UIModal.Actions>
    </UIModal>
  )
}
