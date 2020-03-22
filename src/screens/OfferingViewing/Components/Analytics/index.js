import React from 'react'
import { user, api } from '../../../../utils'
import { parseTimeUpdate, parseEditTrans, parseFilterTrans } from './util'
import './index.css'
import { Message } from 'semantic-ui-react'

export class Analytics extends React.Component {
  constructor(props) {
    super(props)
    this.userInfo = user.getUserInfo()
    this.state = {
      parsedData: []
    }
  }

  componentDidMount() {
    const { offerings } = this.props
    if (offerings[0] !== 'Unloaded') {
      this.getStudentActivities()
    }
  }

  componentDidUpdate(prevProps) {
    // const { offerings, history } = this.props
    const { offerings } = this.props
    if (prevProps.offerings !== offerings && offerings[0] !== 'Unloaded') {
      this.getStudentActivities()
    }
    
  }

  getStudentActivities = async () => {
    const { userInfo } = this
    var parsedData = []
    await api.getUserLogsByEvent('timeupdate', new Date(2018, 11, 24, 10, 33, 30, 0), new Date())
      .then(({data}) => {
        parsedData = parseTimeUpdate(data, this.props.offerings)
        // console.log('?????????', this.props.offerings)
      })

    await api.getUserLogsByEvent('filtertrans', new Date(2018, 11, 24, 10, 33, 30, 0), new Date())
      .then(({data}) => {
        parsedData = parseFilterTrans(data, parsedData)
        // console.log('filtertrans', parsedData)
      })

    await api.getUserLogsByEvent('edittrans', new Date(2018, 11, 24, 10, 33, 30, 0), new Date())
      .then(({data}) => {
        parsedData = parseEditTrans(data, parsedData)
        // console.log('edittrans', parsedData)
      })

    this.setState({ parsedData })
  }

  render() {
    const { parsedData } = this.state
    return (
      <div className="ct-a-fade-in">
        <h1 className="accessbility_hide">Personal Analytics</h1>
        <div>
        <p style = {{ fontSize : "24px"}}>Here is a summary of your activities:</p> 
        </div>

        {
          parsedData.map( elem => 
            <Message key={elem.offeringId}>

              <Message.Header>{elem.offering.fullNumber}</Message.Header>
              <Message.Header>{elem.offering.termName} • {elem.offering.sectionName}</Message.Header>

              <Message.List>
                <Message.Item>Total watching time: {elem.mins} mins</Message.Item>
                <Message.Item>Total number of edits: {elem.editTransCount}</Message.Item>
                <Message.Item>Total number of searches: {elem.filterTransCount}</Message.Item>
              </Message.List>

            </Message>
          )
        }

      </div>
    )
  }
}