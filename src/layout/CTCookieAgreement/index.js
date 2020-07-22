import React, {useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { SignInMenu } from '../CTNavHeader/NavHeaderMenu/SignInMenu';
import './index.scss';
import useStyle from './styles';

export const AGREEMENT_ACCEPTED_KEY = 'agreement_accepted';

function CTCookieAgreement() {
  const styleClasses = useStyle();
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
          
          <p id="cookie-agreement-desc">
            By continuing you agree to the <Link to='/policy/acceptableUse'> acceptable_use policy </Link> and <Link to='/policy/cookie'>cookie policy</Link>.
          </p>
          <div id="cookie-agreement-button-group">
            <Button
              className={styleClasses.cookieAgreementButton}
              onClick={handleClick}
            >
              Accept & Login
            </Button>
            <Button
              className={styleClasses.cookieAgreementButton}
              onClick={acceptSkipLogin}
            >
              Accept & Skip Login
            </Button>
            <Button
              className={styleClasses.cookieAgreementButton}
              onClick={closeWindow}
            >
              Decline & Close Window
            </Button>
          </div>

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
