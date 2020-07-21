import React, {useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { SignInMenu } from '../CTNavHeader/NavHeaderMenu/SignInMenu';
import CTLayout from '../CTLayout';
import './index.scss';


function CTCookieAgreement() {
    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
      >
        <div id='cookie-agreement-dialog-wrapper'>
          <div className="cookie-agreement-dialog-title">
            <h2 className='cookie-agreement-dialog-title'>Welcome To </h2>
            <img 
              src="/static/media/brand-text.320ee44d.png"
              alt="ClassTranscribe" 
            />
          </div>
          
          <p>
            By continuing you agree to the  acceptable_use policy and cookie policy.
          </p>
          <Button>Accept and Login</Button>
          <Button>Accept and Skip Login</Button>
          <Button>Decline and Close Window</Button>
        </div>
      </Dialog>
    )
}

export default CTCookieAgreement
