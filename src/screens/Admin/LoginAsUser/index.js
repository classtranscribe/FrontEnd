import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { CTFragment, CTInput, useButtonStyles } from 'layout';
import { user } from 'utils';

function LoginAsUser() {
  const [emailId, setEmailId] = useState('');
  //  const [password, setPassword] = useState('')

  const handleEmailInput = ({ target: { value }}) => setEmailId(value);
  //  const handlePWInput = text => setPassword(text)

  const onSignIn = () => {
    user.loginAsAccountSignIn(emailId);
  };

  const btn = useButtonStyles();

  return (
    <div id="ap-lsu" className="w-100">
      <h1>Login As Account</h1>
      <hr />
      
      <div className="w-100">
        {user.isLoginAsAccount ? (
          <div className="w-50">
            <div className="mb-3 text-dark">
              Signed in as <strong>{user.getLoginAsUserInfo().emailId}</strong>
            </div>
            <Button 
              variant="contained" 
              className={btn.bold} 
              onClick={user.loginAsAccountSignOut}
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <CTFragment>
            <CTInput
              required
              autoFocus
              id="course-number"
              label="Email"
              placeholder="Email Id"
              value={emailId}
              onReturn={onSignIn}
              onChange={handleEmailInput}
            />

            <CTFragment justConEnd padding="10">
              <Button variant="contained" className={btn.teal} onClick={onSignIn}>
                Sign In
              </Button>
            </CTFragment>
          </CTFragment>
        )}
      </div>
    </div>
  );
}

export default LoginAsUser;
