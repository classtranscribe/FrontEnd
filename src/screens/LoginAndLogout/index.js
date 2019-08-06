import React from 'react'
import { user } from 'utils'

export class LoginAndLogout extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log(window.location)
    if (window.location.pathname === '/login') 
      user.setUpUser(() => {
        window.location = window.location.search.replace('?', '')
      })
    else 
      user.logout()
  }

  render() {
    return null
  }
}