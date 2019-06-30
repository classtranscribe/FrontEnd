import React from 'react'
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import authentication from 'react-azure-adb2c'

import { 
  LoginPage as Homepage, 
  StudentsPage, 
  InstProfilePage, 
  InstOfferingPage,
  VideoPage,
  AdminPage,
} from './pages'
import './App.css'
import 'semantic-ui-css/semantic.min.css'


class App extends React.Component {

  render() {
    const NotFound404 = <div>404</div>
    return (
      <Router basename="/">
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route path="/admin" component={authentication.required(AdminPage)} />
          <Route path="/student" component={authentication.required(StudentsPage)} />
          <Route path="/instructor" component={authentication.required(InstProfilePage)} />
          <Route path="/offering/:id" component={authentication.required(InstOfferingPage)} />
          <Route path="/video" component={VideoPage} />
          <Route component={NotFound404} />
        </Switch>
      </Router>
    )
  }
}

export default App
