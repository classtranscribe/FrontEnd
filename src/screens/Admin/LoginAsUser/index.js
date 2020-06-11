import React, { useState } from 'react';
import { Button } from 'pico-ui';
import { CTForm, CTInput } from 'layout';
import { user } from 'utils';

function LoginAsUser() {
  const [emailId, setEmailId] = useState('');
  //  const [password, setPassword] = useState('')

  const handleEmailInput = ({ target: { value }}) => setEmailId(value);
  //  const handlePWInput = text => setPassword(text)

  const onSignIn = () => {
    user.loginAsAccountSignIn(emailId);
  };

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
            <Button uppercase text="Sign Out" onClick={user.loginAsAccountSignOut} />
          </div>
        ) : (
          <div className="w-50">
            <CTForm
              id="login-as-user-form"
              heading="Login As User"
              onSave={onSignIn}
              onSaveButtonText="Sign In"
            >
              <CTInput
                required
                id="course-number"
                label="Email"
                placeholder="Email Id"
                value={emailId}
                onChange={handleEmailInput}
              />
            </CTForm>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginAsUser;
