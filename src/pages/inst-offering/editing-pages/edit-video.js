import React from 'react'
// UIs
import { GeneralModal, GeneralLoader } from '../../../components'
import { Grid, Form, Button, Input } from 'semantic-ui-react'
// Vars
import { api, handleData, util } from '../../../util'
const initialPlaylist = api.initialData.initialPlaylist;

export class VideoEditingPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.match.params.id,
      video: null,
      videoInfo: handleData.copy(initialPlaylist),
      confirmed: false,
    }
    this.path = '??';
  }

  componentDidMount() {
    // api.getData(this.path)
    //   .then( response => {
    //     this.setState({video: response.data});
    //   })
  }

  onChange = value => {
    const { videoInfo } = this.state;
    videoInfo.description = value;
    this.setState({ videoInfo });
  }

  onUpdate = () => {
    const { video, videoInfo, id } = this.state;
    var data = handleData.updateJson(videoInfo, video)
    data.id = id;
    console.log(data);
    // api.updateData(this.path, data, () => this.onClose())
  }

  onConfirm = () => this.setState({confirmed: true})

  onDelete = () => {
    api.deleteData(this.path, this.state.id, () => this.onClose())
  }

  onClose = () => {
    this.props.history.goBack();
  }

  render() {
    const button = <EditButtons {...this} />
    return(
      <GeneralModal 
        header={'Rename the Video'}
        open={true} size='tiny'
        onClose={this.onClose}
        button={button}
      >
        <VideoForm {...this}/>
      </GeneralModal>
    )
  }
}

function VideoForm(props) {
  const { video } = props.state;

  return (
    <Form className="ap-form">
      {
        video ? 
        <Grid columns='equal' verticalAlign="middle">
          <Grid.Row >
            <Grid.Column>
              <Form.Field
                fluid required
                id='video-description'
                control={Input}
                label='Video Name'
                placeholder='E.g. Part 1'
                defaultValue={video.description}
                onChange={({target: {value}})=> props.onChange(value)}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid> 
        : 
        <GeneralLoader loading inverted />
      }
    </Form>
  )
}

function EditButtons(props) {
  const { videoInfo, video } = props.state;
  return (
    <>
      {
        videoInfo.description // can save the offering iff all the fields if filled
        &&
        <Button positive onClick={props.onUpdate} >Save</Button>
      }
      <Button secondary onClick={props.onClose} >Cancel</Button>
      {
        video // can delete the offering iff the offering is loaded
        && 
        <Button onClick={props.onDelete} >Delete</Button>
      }
    </>
  )
}



