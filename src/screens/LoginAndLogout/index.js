import React from 'react'
import { user } from 'utils'

export class LoginAndLogout extends React.Component {
  componentDidMount() {
    console.log(window.location)
    if (window.location.pathname === '/login') {
      user.setUpUser()
    } else {
      user.signout()
    }
  }

  render() {
    return <div></div>
  }
}