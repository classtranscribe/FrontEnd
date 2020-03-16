import React, { useState } from 'react'
import { Button } from 'pico-ui'
import { CTForm } from '../../../components'
import { user } from '../../../utils'

function LoginAsUser() {
   const [emailId, setEmailId] = useState('')
  //  const [password, setPassword] = useState('')

   const handleEmailInput = text => setEmailId(text)
  //  const handlePWInput = text => setPassword(text)

   const onSignIn = () => {
     user.loginAsAccountSignIn(emailId)
   }

  return (
    <div id="ap-lsu" className="w-100">
      <div className="w-100 ct-d-c-center pt-5">
        {
          user.isLoginAsAccount() 
          ?
          <div className="w-50">
            <h2>LOGIN AS USER</h2>
            <div className="mb-3 text-dark">
              Signed in as <strong>{user.getLoginAsUserInfo().emailId}</strong>
            </div>
            <Button uppercase
              text="Sign Out"
              onClick={user.loginAsAccountSignOut}
            />
          </div>
          :
          <div className="w-50">
            <h2>LOGIN AS USER</h2>
            <CTForm required
              value={emailId}
              label="Email"
              placeholder="Email"
              onChange={handleEmailInput}
            />

            <div className="ct-d-r-end">
              <Button uppercase
                text="Sign in"
                color="teal"
                disabled={!emailId}
                onClick={onSignIn}
              />
            </div>          
          </div>
        }
      </div>
    </div>
  )
}

export default LoginAsUser
