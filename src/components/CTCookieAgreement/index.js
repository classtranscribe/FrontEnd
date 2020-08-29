import React, {useState} from 'react';
import { Dialog, ButtonBase, DialogContent, DialogActions} from '@material-ui/core';
import { useSignButtonProps } from 'layout';
import { user } from 'utils';
import { useStyles } from './styles';
import { CookiePoilcy, AcceptableUsePolicy } from './policies';
import './index.scss';

export const AGREEMENT_ACCEPTED_KEY = 'class_transcribe_agreement_accepted';

function CTCookieAgreement() {
  // Set true to false for testing purposes
  const [dialogOpen, setDialogOpen] = useState(
    !(localStorage.getItem(AGREEMENT_ACCEPTED_KEY) === 'true')
    &&
    !user.isLoggedIn
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const [showPolicy, setShowPolicy] = useState('none');
  const [policyToShow, setPolicyToShow] = useState(null);
  const styleClasses = useStyles();
  const signinButtonProps = useSignButtonProps();

  const handleAcceptLoginClick = (e) => {
    // localStorage.setItem(AGREEMENT_ACCEPTED_KEY, 'true');
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

  const handlePolicyClicking = (policyName) => {
    setShowPolicy('block');
    setPolicyToShow(policyName);
  }

  return (
    <Dialog
      open={dialogOpen} 
      disableBackdropClick
      disableEscapeKeyDown
      fullWidth
      maxWidth='sm'
      scroll='paper'
      id="cookie-agreement-inner-wrapper"
    >
      <div className="cookie-agreement-title">
        <h2>Welcome To </h2>
        <img
          src="/static/media/brand-text.320ee44d.png"
          alt="ClassTranscribe" 
        />
      </div>
        
      <p id="cookie-agreement-desc">
        By continuing you agree to our 
        <ButtonBase 
          className={styleClasses.policyButton} 
          onClick={() => handlePolicyClicking('Acceptable Use')}
        > 
          Acceptable Use Policy
        </ButtonBase>
        and our 
        <ButtonBase 
          className={styleClasses.policyButton}
          onClick={() => handlePolicyClicking('Cookie')}
        >
          Cookie Policy.
        </ButtonBase>
      </p>
      <DialogContent 
        dividers
        style={{display : showPolicy}}
      >
        {policyToShow === 'Acceptable Use' && 
        <AcceptableUsePolicy />}
        {policyToShow === 'Cookie' && 
        <CookiePoilcy />}
      </DialogContent>
      <DialogActions>
        <div id="cookie-agreement-btn-grp">
          <ButtonBase
            {...signinButtonProps}
            className={styleClasses.loginButton}
            // onClick={handleAcceptLoginClick}
            role='button'
          >
            <h3 className='cookie-agreement-btn-h3'>
              Accept & Login
            </h3>
            <p className='cookie-agreement-btn-p'>
              Access all Eligible Videos and Courses
            </p>
          </ButtonBase>
          <ButtonBase
            className={styleClasses.loginButton}
            onClick={handleAcceptSkipLogin}  
            role='button'
          >
            <h3 className='cookie-agreement-btn-h3'>
              Accept & Skip Login
            </h3>
            <p className='cookie-agreement-btn-p'>
              Access only Public Courses
            </p>
          </ButtonBase>
          <ButtonBase
            className={styleClasses.loginButton}
            onClick={handleCloseBrowserWindow}  
            role='button'
          >
            <h3 className='cookie-agreement-btn-h3'>
              Decline and Close Window
            </h3>
            <p> </p>
          </ButtonBase> 
        </div>
      </DialogActions>
    </Dialog>
  );
}

export default CTCookieAgreement
