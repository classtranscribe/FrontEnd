import React, { Component } from 'react'
import { Button, Icon, Modal } from 'semantic-ui-react'
import { VideoTip1, VideoTip2, VideoTip3 } from '../../../images'
import "./index.css"
import { util } from 'utils'

export class VideoTips extends Component{
    state = { 
      open: false, 
      page: 1
    }

    open = () => this.setState({ open: true })
    close = () => {
      this.setState({ open: false })
      util.setOnboard('watch')
    }
    next = () => this.setState({ page: this.state.page+1 })
    prev = () => this.setState({ page: this.state.page-1 })

    componentDidUpdate(prevProps) {
      const { onboarded } = this.props
      if (prevProps.onboarded != onboarded) {
        this.setState({ open: !onboarded })
      }
    }

    render(){
        const { open, page } = this.state

        return (
            <Modal
                className = "general-modal watch-bg-modal"
                open={open}
                onOpen={this.open}
                onClose={this.close}
                size='small'
                closeOnDimmerClick={false}
            >
            <Modal.Header id="watch-bg-modal-header" className="tips_header">
              <Icon name='lightbulb'  />
              Tips
            </Modal.Header>
            <Modal.Content className = "tips-modal" id="watch-bg-modal">
             {this.state.page==1 && 
              <img 
                className="tip_1"
                src={VideoTip1} 
                alt="Star 1"
              />
             }
             {this.state.page==2 && 
              <img 
              className="tip_2"
              src={VideoTip2} 
              alt="Star 1"
              />
              }
              {this.state.page==3 && 
              <img 
              className="tip_3"
              src={VideoTip3} 
              alt="Star 1"
              />
              }
            </Modal.Content>
            <Modal.Actions id="watch-bg-modal-action" className="tips_header">
              {this.state.page >1 && <Button secondary content='Previous' onClick={this.prev} />}
              {this.state.page <3 && <Button secondary content='Next' onClick={this.next} />}
              {this.state.page >=3 && <Button secondary content='Close' onClick={this.close} />}
            </Modal.Actions>
          </Modal>
          )
    }
}