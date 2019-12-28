import React from 'react'
import { Provider } from 'react-redux'
import { instpStore, connectWithRedux } from '_redux/instructor'
import { ClassTranscribeHeader, ClassTranscribeFooter, CTContext } from 'components'
import { api, util } from 'utils'
import './index.css'
import {
  ARRAY_INIT
} from './Utils'

export class Instructor extends React.Component {
  constructor(props) {
    super(props)
    util.links.title('My Courses')
    this.state = {
      courseOfferings: ARRAY_INIT,
    }
  }

  componentDidMount() {
    api.contentLoaded()
  }

  render() {
    return (
      <main className="ip-bg">
        <ClassTranscribeHeader />
      </main>
    )
  }
}

