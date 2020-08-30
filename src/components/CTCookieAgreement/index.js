import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Slide,
  Dialog,
  DialogContent,
  DialogActions,
  ButtonBase,
} from '@material-ui/core';
import { useSignButtonProps, CTFragment, CTText, CTBrand } from 'layout';
import { user } from 'utils';
import { CookiePoilcy, AcceptableUsePolicy } from './policies';
import CookieOption from './CookieOption';
import './index.scss';

export const useStyles = makeStyles({
  policyButton : {
    color: '#328383',
    marginLeft: '4px',
    marginRight: '4px',
    paddingBottom: '2px'
  },
});

export const AGREEMENT_ACCEPTED_KEY = 'ct-cookie-accepted';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function CTCookieAgreement() {
  // Set true to false for testing purposes
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showPolicy, setShowPolicy] = useState('none');
  const [policyToShow, setPolicyToShow] = useState(null);
  const classes = useStyles();
  const signinButtonProps = useSignButtonProps();

  useEffect(() => {
    setTimeout(() => {
      setDialogOpen(
        !(localStorage.getItem(AGREEMENT_ACCEPTED_KEY) === 'true')
        &&
        !user.isLoggedIn
      );
    }, 1500);
  }, []);

  const handleCloseBrowserWindow = () => {
    window.open('about:blank', '_self').close();
  };

  const handleAcceptSkipLogin = () => {
    setDialogOpen(false);
    localStorage.setItem(AGREEMENT_ACCEPTED_KEY, 'true');
  };

  const handlePolicyClicking = (policyName) => {
    setShowPolicy('block');
    setPolicyToShow(policyName);
  };

  const cookieOptions = [
    {
      name: 'Accept and Sign In',
      desp: 'Access all eligible videos and courses.',
      icon: 'verified_user',// 'perm_identity',//'login',
      ...signinButtonProps
    },
    {
      name: 'Accept and Skip Sign In',
      desp: 'Access only public sources.',
      icon: 'check_circle_outline',
      onClick: handleAcceptSkipLogin
    },
    {
      name: 'Decline and Close Window',
      desp: `Accepting cookie policies are required to access ClassTranscribe's content.`,
      muted: true,
      icon: 'block',// 'error_outline',
      onClick: handleCloseBrowserWindow
    }
  ];

  return (
    <Dialog
      open={dialogOpen} 
      disableBackdropClick
      disableEscapeKeyDown
      fullWidth
      maxWidth='sm'
      scroll='paper'
      id="cookie-agreement-inner-wrapper"
      TransitionComponent={Transition}
    >
      <CTFragment hCenter vEnd padding={[30, 0]}>
        <CTText size="huge" bold>Welcome To</CTText>
        <CTBrand size="large" />
      </CTFragment>
        
      <CTText size="medium" muted padding={[0, 20, 20, 25]}>
        By continuing you agree to our 
        <ButtonBase 
          className={classes.policyButton} 
          onClick={() => handlePolicyClicking('Acceptable Use')}
        > 
          Acceptable Use Policy
        </ButtonBase>
        and our 
        <ButtonBase 
          className={classes.policyButton}
          onClick={() => handlePolicyClicking('Cookie')}
        >
          Cookie Policy.
        </ButtonBase>
      </CTText>

      <DialogContent 
        dividers
        style={{display : showPolicy}}
        className="policy-container"
      >
        {policyToShow === 'Acceptable Use' && <AcceptableUsePolicy />}
        {policyToShow === 'Cookie' && <CookiePoilcy />}
      </DialogContent>

      <DialogActions className="policy-acp-btns">
        <CTFragment 
          list 
          role="list" 
          className="ct-signin-opts"
          padding={[0,0,20,0]}
        >
          {cookieOptions.map(opt => (
            <CookieOption
              {...opt}
              key={opt.name}
            />
          ))}
        </CTFragment>
      </DialogActions>
    </Dialog>
  );
}

export default CTCookieAgreement
