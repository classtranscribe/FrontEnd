import React, { Component } from 'react'
import { Button, Icon, Modal } from 'semantic-ui-react'
import { UserTipsSearch as TipSearch, UserTipsStar as TipStar } from '../../../images'
import "./index.css"

export class HomepageTips extends Component{
    state = { open: true, page: 1}
    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })
    next = () => this.setState({ page: this.state.page+1 })
    prev = () => this.setState({ page: this.state.page-1 })

    render(){
      const { open, page } = this.state
      return (
        <Modal
            className = "general-modal"
            open={open}
            onOpen={this.open}
            onClose={this.close}
            size='small'
            closeOnDimmerClick={false}
        >
        <Modal.Header className="tips_header">
          <Icon name='lightbulb'  />
          Tips
        </Modal.Header>
        <Modal.Content className = "tips-modal">
         {this.state.page==1 && 
          <img 
            className="tip_image_search"
            src={TipSearch} 
            alt="Star 1"
          />
         }
         {this.state.page==2 && 
          <img 
          className="tip_image_star"
          src={TipStar} 
          alt="Star 1"
          />
          }
        </Modal.Content>
        <Modal.Actions>
          {this.state.page >1 && <Button secondary content='Previous' onClick={this.prev} />}
          {this.state.page <2 && <Button secondary content='Next' onClick={this.next} />}
          {this.state.page >=2 && <Button secondary content='Close' onClick={this.close} />}
        </Modal.Actions>
      </Modal>
      )
    }
}
