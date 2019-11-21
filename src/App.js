import React from 'react'
import { withRouter, Route, Switch, Redirect } from 'react-router-dom'

import { 
  NotFound404,
  Maintenance,
  OfferingViewing, 
  InstructorProfile, 
  InstructorOffering,
  LoginAndLogout,
  Admin,
  Watch,
} from './screens'
import './App.css'
import 'semantic-ui-css/semantic.min.css'
import { CTContext } from './components'
import { util } from './utils'

class App extends React.Component {
  componentDidMount() {
    util.fixUserMetadata()
    window.onbeforeunload = () => {
      util.removeStoredOfferings()
    }
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props
    if (location !== prevProps.location) {
      const { removeAlert } = this.context
      removeAlert()
    }
  }

  render() {
    // return <Maintenance />
    return (
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/home" />} />
        <Route exact path="/login" component={LoginAndLogout} />
        <Route exact path="/logout" component={LoginAndLogout} />
        <Route path="/home" component={OfferingViewing} />
        <Route exact path="/video" component={Watch} />
        <Route path="/admin" component={Admin} />
        <Route path="/instructor" component={InstructorProfile} />
        <Route path="/offering/:id" component={InstructorOffering} />
        {/* <Route path="/offering-setting/:type?=:id" component={OfferingSettingPage} /> */}

        <Route path="/404" component={NotFound404} />
        <Route component={NotFound404} />
      </Switch>
    )
  }
}

App.contextType = CTContext

export default withRouter(App)
