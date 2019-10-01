import React from 'react'
import { user, api } from 'utils'

export class PersonalReport extends React.Component {
  constructor(props) {
    super(props)
    this.userInfo = user.getUserInfo()
    this.state = {
      edittrans: []
    }
  }

  componentDidMount() {
    this.getEditTrans()
  }

  getEditTrans = () => {
    const { userInfo } = this
    api.getStudentLogs('edittrans', userInfo.emailId, new Date(2018, 11, 24, 10, 33, 30, 0), new Date())
      .then(({data}) => {
        
        data.forEach(event => {
          event.offering = this.props.offerings.filter(offering => offering.id === event.offeringId)[0]
        })
        console.log('edittrans', data)
        this.setState({ edittrans: data })
        
      })
  }

  render() {
    const { edittrans } = this.state
    return (
      <div>
        {
          edittrans.map( event => (
            <div>{event.offeringId}</div>
          ))
        }
      </div>
    )
  }
}