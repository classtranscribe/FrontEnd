import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import authentication from 'react-azure-adb2c'

import { 
  OfferingViewing, 
  InstructorProfile, 
  InstructorOffering,
  VideoPage,
  Admin,
} from './screens'
import './App.css'
import 'semantic-ui-css/semantic.min.css'
import { user, util } from './util'

class App extends React.Component {
  render() {
    /**
     * Redirect the page if a unauthed user want to access a authed one
     */
    if (!user.id()) { // not logged in
      const { pathname } = window.location
      if (pathname.includes('student')) { // replace the authed page with unauthed one
        window.location = pathname.replace('/student', '')
      } else if (util.isAuthedPage(pathname)) {
        window.location = util.links.home()
      }
    }

    const NotFound404 = () => <div>404</div>
    return (
      <Router basename="/">
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/home" />} />
          <Route path="/home" component={OfferingViewing} />
          <Route path="/admin" component={authentication.required(Admin)} />
          <Route path="/student" component={authentication.required(OfferingViewing)} />
          <Route path="/instructor" component={authentication.required(InstructorProfile)} />
          <Route path="/offering/:id" component={authentication.required(InstructorOffering)} />
          <Route path="/video" component={VideoPage} />
          <Route component={NotFound404} />
        </Switch>
      </Router>
    )
  }
}

export default App
