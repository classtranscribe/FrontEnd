import React from 'react'
import { user, util } from '../../utils'

export class LoginAndLogout extends React.Component {
  componentDidMount() {
    console.log(window.location)
    if (window.location.pathname === util.links.signin()) {
      user.setUpUser()
    } else {
      user.signout()
    }
  }

  render() {
    return <div></div>
  }
}