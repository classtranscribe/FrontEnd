import React from 'react'
import { user, api } from 'utils'
import { parseTimeUpdate, parseEditTrans, parseFilterTrans } from './util'
import './index.css'
import { Message } from 'semantic-ui-react'

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
    this.getStudentActivities()
  }

  getStudentActivities = async () => {
    const { userInfo } = this
    var parsedData = []
    await api.getStudentLogs('timeupdate', userInfo.emailId, new Date(2018, 11, 24, 10, 33, 30, 0), new Date())
      .then(({data}) => {
        parsedData = parseTimeUpdate(data, this.props.offerings)
        console.log('timeupdate', parsedData)
      })

    await api.getStudentLogs('filtertrans', userInfo.emailId, new Date(2018, 11, 24, 10, 33, 30, 0), new Date())
      .then(({data}) => {
        parsedData = parseFilterTrans(data, parsedData)
        console.log('filtertrans', parsedData)
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

        <div>
        <p style = {{ fontSize : "24px"}}>Hello! Here is a summary of your activities:</p> 
        </div>

        {
          parsedData.map( elem => 
            <Message key={elem.offeringId}>

              <Message.Header>{elem.offering.fullNumber}</Message.Header>

              <Message.List>
                <Message.Item>Total watching time: {elem.mins} mins</Message.Item>
                <Message.Item>Total editing times: {elem.editTransCount}</Message.Item>
                <Message.Item>Total searhcing times: {elem.filterTransCount}</Message.Item>
              </Message.List>

            </Message>
          )
        }

      </div>
    )
  }
}