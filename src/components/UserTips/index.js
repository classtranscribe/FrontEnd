import React, { Component } from 'react'
import { Button, Icon, Modal } from 'semantic-ui-react'
import { UserTipsStar as Star1, UserTipsStarResult as Star2 } from '../../images'
import "./index.css"

export class UserTips extends Component{
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
        <Modal.Header>Tips {page}/5</Modal.Header>
        <Modal.Content className = "tips-modal">
         {this.state.page==1 && 
         <>
          <p>Tip 1:<br/>Star</p>
          <img 
            className="tip_image"
            src={Star1} 
            alt="Star 1"
          />
          <img 
            className="tip_image"
            src={Star2} 
            alt="Star 2s"
          />
          </>
         }
         {this.state.page==2 && <p>Tip 2:<br/>Filter</p>}
         {this.state.page==3 && <p>Tip 3:<br/>Search</p>}
         {this.state.page==4 && <p>Tip 4:<br/>Temp</p>}
         {this.state.page==5 && <p>Tip 5:<br/>Temp</p>}
        </Modal.Content>
        <Modal.Actions>
          {this.state.page <5 && <Button content='Skip' onClick={this.close} />}
          {this.state.page >1 && <Button secondary content='Previous' onClick={this.prev} />}
          {this.state.page <5 && <Button secondary content='Next' onClick={this.next} />}
          {this.state.page >=5 && <Button secondary content='Close' onClick={this.close} />}
        </Modal.Actions>
      </Modal>
      )
    }
}
