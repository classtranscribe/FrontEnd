import React from 'react'
import { user, util } from '../../utils'

export class LoginAndLogout extends React.Component {
  componentDidMount() {
    if (util.links.isEqual(util.links.signin())) {
      user.setUpUser()
    } else {
      user.signout()
    }
  }

  render() {
    return <div></div>
  }
}