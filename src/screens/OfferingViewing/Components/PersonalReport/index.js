import React from 'react'
import { user, api } from 'utils'
import { parseTimeUpdate, parseEditTrans } from './util'
import './index.css'

export class PersonalReport extends React.Component {
  constructor(props) {
    super(props)
    this.userInfo = user.getUserInfo()
    this.state = {
      parsedData: []
    }
  }

  componentDidMount() {
    // const { offerings, history } = this.props
    this.getEditTrans()
  }

  getEditTrans = async () => {
    const { userInfo } = this
    var parsedData = []
    await api.getStudentLogs('timeupdate', userInfo.emailId, new Date(2018, 11, 24, 10, 33, 30, 0), new Date())
      .then(({data}) => {
        parsedData = parseTimeUpdate(data, this.props.offerings)
        console.log('timeupdate', parsedData)
      })

    await api.getStudentLogs('edittrans', userInfo.emailId, new Date(2018, 11, 24, 10, 33, 30, 0), new Date())
      .then(({data}) => {
        parsedData = parseEditTrans(data, parsedData)
        console.log('edittrans', parsedData)
      })

    this.setState({ parsedData })
  }

  render() {
    const { parsedData } = this.state
    return (
      <div>
        {
          parsedData.map( elem => (
            <div key={elem.offeringId}>
              {elem.offering.fullNumber}<br/>
              Total editing times: {elem.editTransCount}<br/>
              Total watching times: {elem.mins} mins
            </div>
          ))
        }
      </div>
    )
  }
}