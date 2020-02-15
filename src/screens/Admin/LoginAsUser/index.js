import React, { useState } from 'react'
import { Button } from 'pico-ui'
import './index.scss'
import { CTForm } from '../../../components'
import { user } from '../../../utils'

function LoginAsUser() {
   const [emailId, setEmailId] = useState('')
   const [password, setPassword] = useState('')

   const handleEmailInput = text => setEmailId(text)
   const handlePWInput = text => setPassword(text)

   const onSignIn = () => {
     user.testAccountSignIn(emailId, password)
   }

  return (
    <div id="ap-lsu" className="w-100">
      <div className="w-100 ct-d-c-center">
        <h2>LOGIN AS USER</h2>
        {
          user.isTestAccount() 
          ?
          <div className="w-50">
            <div className="mb-3 text-dark">
              Signed in as <strong>{user.getTestUserInfo().emailId}</strong>
            </div>
            <Button uppercase
              text="Sign Out"
              onClick={user.testAccountSignOut}
            />
          </div>
          :
          <div className="w-50">
            <CTForm required
              value={emailId}
              label="Email"
              placeholder="Email"
              onChange={handleEmailInput}
            />
            <div className="w-100 mt-4">
              <CTForm required
                value={password}
                label="Password"
                placeholder="Password"
                onChange={handlePWInput}
              />
            </div>

            <div className="ct-d-r-end">
              <Button uppercase
                text="Sign in"
                color="teal"
                disabled={!emailId || !password}
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
