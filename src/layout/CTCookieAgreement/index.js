import React, {useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Link } from 'react-router-dom';
import { SignInMenu } from '../CTNavHeader/NavHeaderMenu/SignInMenu';
import { useStyles } from './styles';
import './index.scss';

export const AGREEMENT_ACCEPTED_KEY = 'class_transcribe_agreement_accepted';

function CTCookieAgreement() {
  // Set true to false for testing purposes
  const [dialogOpen, setDialogOpen] = useState(!(localStorage.getItem(AGREEMENT_ACCEPTED_KEY) === 'true'));
  const [anchorEl, setAnchorEl] = useState(null);
  const styleClasses = useStyles();

  const handleAcceptLoginClick = (e) => {
    localStorage.setItem(AGREEMENT_ACCEPTED_KEY, 'true');
    setAnchorEl(e.currentTarget);
  };
  
  const handleAcceptLoginClose = () => {
    setTimeout(() => setAnchorEl(null), 200);
  };

  const handleCloseBrowserWindow = () => {
    window.open('about:blank', '_self').close();
  }

  const handleAcceptSkipLogin = () => {
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
      <div id='cookie-agreement-inner-wrapper'>
        <div className="cookie-agreement-title">
          <h2>Welcome To </h2>
          <img
            src="/static/media/brand-text.320ee44d.png"
            alt="ClassTranscribe" 
          />
        </div>
          
        <p id="cookie-agreement-desc">
          By continuing you agree to the <Link to='/policy/acceptableUse'> acceptable_use policy</Link> and <Link to='/policy/cookie'>cookie policy</Link>.
        </p>
        <div id="cookie-agreement-btn-grp">
          <ButtonBase
            className={styleClasses.button}
            onClick={handleAcceptLoginClick}
            role='button'
            tabIndex='0'
          >
            <h3 className='cookie-agreement-btn-h3'>
              Accept & Login
            </h3>
            <p className='cookie-agreement-btn-p'>
              Access all Eligible Videos and Courses
            </p>
          </ButtonBase>
          <ButtonBase
            className={styleClasses.button}
            onClick={handleAcceptSkipLogin}  
            role='button'
            tabIndex='0'
          >
            <h3 className='cookie-agreement-btn-h3'>
              Accept & Skip Login
            </h3>
            <p className='cookie-agreement-btn-p'>
              Access only Public Courses
            </p>
          </ButtonBase>
          <ButtonBase
            className={styleClasses.button}
            onClick={handleCloseBrowserWindow}  
            role='button'
            tabIndex='0'
          >
            <h3 className='cookie-agreement-btn-h3'>
              Decline and Close Window
            </h3>
            <p> </p>
          </ButtonBase> 
        </div>

        <SignInMenu 
          open={Boolean(anchorEl)} 
          anchorEl={anchorEl} 
          handleClose={handleAcceptLoginClose}
        />
      </div>
    </Dialog>
  );
}

export default CTCookieAgreement
