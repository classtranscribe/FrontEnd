import React from 'react'
import { GeneralModal, GeneralLoader } from '../../../components'
import { Grid, Form, Button, Input } from 'semantic-ui-react'
// Vars
import { api, handleData, util } from '../../../util'
const initialPlaylist = api.initialData.initialPlaylist;

export class PlaylistEditingPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.match.params.id,
      type: this.props.match.params.type,
      isNew: this.props.match.params.type === 'new',

      playlist: null,
      playlistInfo: handleData.copy(initialPlaylist),
      confirmed: false,
    }
    this.path = '??';
  }

  componentDidMount() {
    // api.getData(this.path)
    //   .then( response => {
    //     this.setState({playlist: response.data});
    //   })
  }

  onChange = value => {
    const { playlistInfo } = this.state;
    playlistInfo.description = value;
    this.setState({ playlistInfo });
  }

  onCreate = () => {
    const { playlistInfo, isNew, id } = this.state;
    if ( isNew ) playlistInfo.offeringId = id;
    // api.postData(this.path, playlistInfo, response => {});
    console.log(playlistInfo);
  }

  onUpdate = () => {
    const { playlist, playlistInfo, id } = this.state;
    var data = handleData.updateJson(playlistInfo, playlist)
    data.id = id;
    console.log(data);
    // api.updateData(this.path, data, () => this.onClose())
  }

  onConfirm = () => this.setState({confirmed: true})

  onDelete = () => {
    api.deleteData(this.path, this.state.id, () => this.onClose())
  }

  onClose = () => {
    const { isNew, id } = this.state;
    if (isNew) util.toOfferingPage(id);
    else this.props.history.goBack();
  }

  onCancel = () => {
    this.props.history.goBack();
  }

  render() {
    const { isNew } = this.state;
    // console.log(id)
    const header = isNew ? 'New Playlist' : 'Edit Playlist';
    const button = isNew ? <SaveButtons {...this}/>
                         : <EditButtons {...this} />;
    return(
      <GeneralModal 
        header={header}
        open={true} size='tiny'
        onClose={this.onCancel}
        button={button}
      >
        <PlaylistForm isNew={isNew} {...this}/>
      </GeneralModal>
    )
  }
}

function PlaylistForm(props) {
  const { onChange } = props;
  const playlist = props.isNew ? initialPlaylist : props.state.playlist;

  return (
    <Form className="ap-form">
      {
        playlist ? 
        <Grid columns='equal' verticalAlign="middle">
          <Grid.Row >
            <Grid.Column>
              <Form.Field
                fluid required
                id='paylist-description'
                control={Input}
                label='Playlist Name'
                placeholder='E.g. Lecture 1'
                defaultValue={playlist.description}
                onChange={({target: {value}})=> onChange(value)}
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

function SaveButtons(props) {
  const { description } = props.state.playlistInfo;
  return (
    <>
      {
        description // can save the offering iff all the fields if filled
          &&
        <Button positive onClick={props.onCreate} >Save</Button>
      }
      <Button onClick={props.onCancel} >Cancel</Button>
    </>
  )
}

function EditButtons(props) {
  const { playlistInfo, playlist } = props.state;
  return (
    <>
      {
        playlistInfo.description // can save the offering iff all the fields if filled
        &&
        <Button positive onClick={props.onUpdate} >Save</Button>
      }
      <Button secondary onClick={props.onCancel} >Cancel</Button>
      {
        playlist // can delete the offering iff the offering is loaded
        && 
        <Button onClick={props.onDelete} >Delete</Button>
      }
    </>
  )
}



