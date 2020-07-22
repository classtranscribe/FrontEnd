import React, {useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { SignInMenu } from '../CTNavHeader/NavHeaderMenu/SignInMenu';
import CTLayout from '../CTLayout';
import './index.scss';

export const AGREEMENT_ACCEPTED_KEY = 'agreement_accepted';

function CTCookieAgreement() {
    const [dialogOpen, setDialogOpen] = useState(!(localStorage.getItem(AGREEMENT_ACCEPTED_KEY) === 'false'));// change to true
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (e) => {
      setAnchorEl(e.currentTarget);
    };
  
    const handleClose = () => {
      setTimeout(() => setAnchorEl(null), 200);
    };

    const closeWindow = () => {
      window.open('about:blank', '_self').close();
    }

    const acceptSkipLogin = () => {
      setDialogOpen(false);
      localStorage.setItem(AGREEMENT_ACCEPTED_KEY, 'true');
    }

    return (
      <Dialog
        open={dialogOpen} 
        disableBackdropClick
        disableEscapeKeyDown
        fullWidth
        maxWidth='sm'
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
          <Button onClick={handleClick}>Accept and Login</Button>
          <Button onClick={acceptSkipLogin}>Accept and Skip Login</Button>
          <Button onClick={closeWindow}>Decline and Close Window</Button>
          <SignInMenu 
            open={Boolean(anchorEl)} 
            anchorEl={anchorEl} 
            handleClose={handleClose}
          />
        </div>
      </Dialog>
    )
}

export default CTCookieAgreement
