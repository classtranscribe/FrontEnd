import React from 'react'
// UIs
import { Tab } from 'react-bootstrap'
import './index.css';
import SideBar from './sidebar.js'
import EmptyResult from './emptyresult.js'
import Videos from './videolist.js'
// Components
import { 
  OfferingFormModal, 
  PlaylistFormModal,
  VideoFormModal,
  DeleteModal, 
  CourseSettingHeader,
} from '../../components'
// Vars
import { fakeData } from '../../data';
const initialStates = {
  displaySideBar: (window.innerWidth < 900) ? false : true,

  editOffering: false,
  offeringInfo: { term: '', sec: '' },

  newPlaylist: false,
  currPlaylistIdx: 0,
  editPlaylist: false,
  deletePlaylist: false,
  playlistInfo: { name: '', copyOffering: 0, copyPlaylist: 0 },

  uploadingVideo: false,
  editVideo: false,
  deleteVideo: false,
  currVideoIdx: 0,
  videoInfo: { name: '' },

  showAlert: false,
  alertType: 'default',
};


export class InstOfferingPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = initialStates;
    this.playlists = fakeData.playlists; // []
    this.course = fakeData.instData.courses.length ? fakeData.instData.courses[0] : null;
    this.offering = this.course ? this.course.offerings[0] : null;
  }

  isSelectInput = item => 
      item === 'term' || item === 'copyOffering' || item === 'copyPlaylist'

  /**
   * @param info
   * - 'offeringInfo' : term, sec
   * - 'playlistInfo' : name 
   * - 'videoInfo'    : name
   */
  onInputChange = (event, info, item) => {
    const newInfo = this.state[info];
    console.log(event)
    newInfo[item] = (this.isSelectInput(item)) ? event.value : event.target.value;    
    this.setState({[info]: newInfo});
  }

  /**
   * @param info 
   * - 'offeringInfo'
   * - 'playlist', 'editPlaylist', 'deletePlaylist'
   * - 'editVideo', 'deleteVideo'
   */
  onSave = info => {
    const { playlistInfo, currPlaylistIdx, currVideoIdx, videoInfo } = this.state;
    const currPlaylist = this.playlists[currPlaylistIdx];
    const currVideo = currPlaylist.videos[currVideoIdx];
    var newInfo;
    if (info === 'offeringInfo') {
      const {offeringInfo} = this.state;
      newInfo = {
        term: offeringInfo.term || this.offering.term, 
        sec: offeringInfo.sec || this.offering.sec
      };
    } else if (info === 'editPlaylist') {
      newInfo = {name: playlistInfo.name || currPlaylist.name}
    } else if (info === 'playlist') {
      newInfo = this.state.playlistInfo;
    } else if (info === 'editVideo') {
      newInfo = {name: videoInfo.name || currVideo.name}
    }
    console.log(newInfo);
    this.onCloseOrOpen(info)

    if (info.substring(0, 6) === 'delete') this.setAlert('deleted')
    else this.setAlert('saved');
    if (!this.state.showAlert) {
      this.onCloseOrOpen('alert');
      setTimeout(()=>{
        if (this.state.showAlert) return this.onCloseOrOpen('alert');
      }, 3000);
    };
  }

  /**
   * @param info 
   * - 'sidebar', 'alert'
   * - 'offeringInfo'
   * - 'playlist', 'editPlaylist', 'deletePlaylist'
   * - 'uploading', 'editVideo', 'deleteVideo'
   */
  onCloseOrOpen = info => {
    if      (info === 'sidebar'       ) this.setState({displaySideBar: !this.state.displaySideBar})
    else if (info === 'offeringInfo'  ) this.setState({editOffering: !this.state.editOffering})
    else if (info === 'playlist'      ) this.setState({newPlaylist: !this.state.newPlaylist})
    else if (info === 'editPlaylist'  ) this.setState({editPlaylist: !this.state.editPlaylist})
    else if (info === 'deletePlaylist') this.setState({deletePlaylist: !this.state.deletePlaylist})
    else if (info === 'uploading'     ) this.setState({uploadingVideo: !this.state.uploadingVideo})
    else if (info === 'editVideo'     ) this.setState({editVideo: !this.state.editVideo})
    else if (info === 'deleteVideo'   ) this.setState({deleteVideo: !this.state.deleteVideo})
    else if (info === 'alert'         ) this.setState({showAlert: !this.state.showAlert})
  }

  /**
   * @param opt 
   * - (success) default, saved, deleted, uploaded, 
   * - (danger) wrong, wrongType
   */
  setAlert = opt => {
    this.setState({alertType: opt})
  }

  /**
   * @param info currPlaylistIdx, currVideoIdx
   */
  setIndex = (info, index) => {
    this.setState({[info]: index})
  }

  componentDidMount() {
    /* listen on window size for showing or hiding sidebar */
    window.addEventListener('resize', ()=>{
      if (window.innerWidth < 900) this.setState({displaySideBar: false})
      else this.setState({displaySideBar: true});
    });
  }

  /* Dimmer wrapper component when side bar is floating */
  wrapper() {
    const showWrapper = {display: (this.state.displaySideBar && window.innerWidth < 900) ? 'block' : 'none'}
    return (
      <div 
        style={showWrapper} className="cs-wrapper"
        onClick={()=>this.onCloseOrOpen('sidebar')}
      ></div>
    )
  }

  render() {
    const {
      newPlaylist, editPlaylist, currPlaylistIdx, deletePlaylist,
      editVideo, currVideoIdx, deleteVideo,
    } = this.state;
    const currPlaylist = this.playlists.length ? this.playlists[currPlaylistIdx] : null;
    const currVideo = currPlaylist ? currPlaylist.videos[currVideoIdx] : null;
    // the padding style when sidebar is not floating
    var paddingLeft = {
      paddingLeft: (this.state.displaySideBar && window.innerWidth > 900) ? '20rem' : '0'
    }
    
    return (
      <>
{/* Modals here */}
      <OfferingFormModal
        offering={this.offering}
        open={this.state.editOffering}
        onClose={this.onCloseOrOpen}
        onSave={this.onSave}
        onChange={this.onInputChange}
      />
      <PlaylistFormModal 
        {...this}
        open={newPlaylist || editPlaylist}
        playlist={newPlaylist ? null : currPlaylist}
        onChange={this.onInputChange}
        onSave={this.onSave}
        onClose={this.onCloseOrOpen}
        info={newPlaylist ? 'playlist' : 'editPlaylist'}
      />
      <VideoFormModal 
        open={editVideo}
        video={currVideo}
        onClose={this.onCloseOrOpen}
        onSave={this.onSave}
        onChange={this.onInputChange}
        info='editVideo'
      />
      <DeleteModal 
        target={currPlaylist ? `playlist ${currPlaylist.name}` : ''}
        open={deletePlaylist}
        onSave={()=>this.onSave('deletePlaylist')}
        onClose={()=>this.onCloseOrOpen('deletePlaylist')}
      />
      <DeleteModal 
        target={`video ${currVideo}`}
        open={deleteVideo}
        onSave={()=>this.onSave('deleteVideo')}
        onClose={()=>this.onCloseOrOpen('deleteVideo')}
      />
{/* Page Layout */}
      {this.wrapper()}
      <div className="course-container">        
        <CourseSettingHeader showSiderBar={()=>this.onCloseOrOpen('sidebar')} />
        <Tab.Container 
          className="content" 
          defaultActiveKey={this.playlists.length ? this.playlists[0].name : 'noPlaylists'}
        >
          <SideBar 
            {...this}
            display={this.state.displaySideBar} 
            history={this.props.history}
            editOffering={()=>this.onCloseOrOpen('offeringInfo')}
            newPlaylist={()=>this.onCloseOrOpen('playlist')}
          />
          <Tab.Content className="content-result" style={paddingLeft}>
            <EmptyResult 
              {...this}
              newPlaylist={()=>this.onCloseOrOpen('playlist')}
            />
            <Tab.Pane eventKey="data">
              data here.
            </Tab.Pane>
            <Videos 
              onCloseOrOpen={this.onCloseOrOpen}
              {...this} // setIndex, setAlert
              {...this.state} // showAlert, alertType
            />
          </Tab.Content>
        </Tab.Container>
      </div>
      </>
    );
  }
}
