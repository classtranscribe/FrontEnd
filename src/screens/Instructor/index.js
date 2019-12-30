import React from 'react'
import { Provider } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { instpStore, connectWithRedux } from '_redux/instructor'
import { ClassTranscribeHeader, CTContext } from 'components'
import {
  Sidebar,
  Course,
  Playlist,
} from './Components'
import { api, util, user } from 'utils'
import './index.css'
import {
  parseCourseOfferings,
  ARRAY_INIT,
} from './Utils'

export class InstructorWithRedux extends React.Component {
  constructor(props) {
    super(props)
    util.links.title('My Courses')
  }

  showSiderBar = value => {
    const { setSidebar, sidebar } = this.props
    if (typeof value === "boolean") {
      setSidebar( value )
    } else {
      setSidebar( !sidebar )
    }
  }

  componentDidMount() {
    this.setupInstPage()
  }

  setupInstPage = async () => {
    if (this.checkAuthentication()) {
      await this.getCourseOfferingsByInstructorId()
    }
  }

  checkAuthentication = () => {
    if (!user.isLoggedIn()) {
      user.login()
    } else if (!user.isInstructor()) {
      window.location = util.links.notfound404()
    }
    return true
  }

  /**
   * Callback for setUpUser below
   */
  getCourseOfferingsByInstructorId = async () => {
    if (this.props.offerings.length > 0) return;
    try {
      let { data } = await api.getCourseOfferingsByInstructorId(user.userId())
      let departments = await this.getDepartsByUniversityId()
      let terms = await this.getTermsByUniversityId()
      let offerings = parseCourseOfferings(data, departments, terms)

      // console.log('offerings', offerings)
      // console.log('departments', departments)
      // console.log('terms', terms)

      const { setOfferings, setDeparts, setTerms, setOffering } = this.props
      setTerms(terms)
      setDeparts(departments)
      setOfferings(offerings)

      api.contentLoaded()
    } catch (error) {
      const { generalError } = this.context
      generalError({ header: "Couldn't load courses." })
    }
  }

  getDepartsByUniversityId = async () => {
    let { data } = await api.getDepartsByUniId(user.getUserInfo().universityId)
    return data
  }

  getTermsByUniversityId = async () => {
    let { data } = await api.getTermsByUniId(user.getUserInfo().universityId)
    return data
  }

  render() {
    const { sidebar } = this.props
    const paddingLeft = {
      paddingLeft: (sidebar && window.innerWidth > 900) ? '19em' : '0'
    }

    return (
      <div className="ip-bg">
        <ClassTranscribeHeader
          showSiderBar={this.showSiderBar} 
          display={sidebar}
        />

        <Sidebar
          showSiderBar={this.showSiderBar}
        />

        <main className="ip-container" style={paddingLeft}>
          <Course />
          <Playlist />
        </main>
      </div>
    )
  }
}

InstructorWithRedux.contextType = CTContext

export function Instructor(props) {
  const InstpConnectToRedux = withRouter(connectWithRedux(
    InstructorWithRedux,
    [
      'sidebar',
      'offerings'
    ],
    [
      'setOfferings', 
      'setOffering',
      'setDeparts',
      'setTerms',
      'setSidebar'
    ]
  ))

  return (
    <Provider store={instpStore}>
      <InstpConnectToRedux {...props} />
    </Provider>
  )
}