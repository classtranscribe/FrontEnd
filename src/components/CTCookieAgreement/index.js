import React, { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { DialogContent, DialogActions, ButtonBase } from '@material-ui/core';
import { CTFragment, CTText, CTBrand, CTList, CTModal } from 'layout';
import { user, links } from 'utils';
import { CookiePoilcy, AcceptableUsePolicy } from './policies';
import './index.scss';

export const AGREEMENT_ACCEPTED_KEY = 'ct-cookie-accepted';

function CTCookieAgreement() {
  // Set true to false for testing purposes
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showPolicy, setShowPolicy] = useState('none');
  const [policyToShow, setPolicyToShow] = useState(null);

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
    if (policyName === policyToShow) {
      setShowPolicy('none');
      setPolicyToShow(null);
    } else {
      setShowPolicy('block');
      setPolicyToShow(policyName);
    }
  };

  const titleSize = isMobile ? 'medium' : 'big';
  const despSize = isMobile ? 'normal' : 'medium';

  const itemStyles = { titleSize, despSize };

  const cookieOptions = [
    {
      title: 'Accept and Sign In',
      description: 'Access all eligible videos and courses.',
      icon: 'verified_user',// 'perm_identity',//'login',
      link: true,
      to: links.signIn(),
      ...itemStyles
    },
    {
      title: 'Accept and Skip Sign In',
      description: 'Access only public sources.',
      icon: 'check_circle_outline',
      onClick: handleAcceptSkipLogin,
      ...itemStyles
    },
    {
      title: 'Decline and Close Window',
      description: `Accepting cookie policies are required to access ClassTranscribe's content.`,
      icon: 'block',// 'error_outline',
      onClick: handleCloseBrowserWindow,
      ...itemStyles
    }
  ];

  return (
    <CTModal
      open={dialogOpen} 
      disableBackdropClick
      disableEscapeKeyDown
      fullWidth
      maxWidth='sm'
      container
      transition
      scroll='paper'
      id="cookie-agreement-inner-wrapper"
    >
      <CTFragment
        padding={[30, 0]} 
        className="cookie-acp-title"
      >
        <CTText size="huge" bold className="welcome-txt">Welcome To</CTText>
        <CTBrand size="large" />
      </CTFragment>
        
      <CTText size="medium" muted padding={[0, 20, 20, 25]}>
        By continuing you agree to our 
        <ButtonBase 
          className="policy-btn" 
          onClick={() => handlePolicyClicking('Acceptable Use')}
        > 
          Acceptable Use Policy
        </ButtonBase>
        and our 
        <ButtonBase 
          className="policy-btn"
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

      <DialogActions className="cookie-acp-btns">
        <CTList items={cookieOptions} />
      </DialogActions>
    </CTModal>
  );
}

export default CTCookieAgreement
