import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { env, uurl, user, prompt } from 'utils';
import { CTFragment, CTBrand, CTText } from 'layout';
import { useLoaded } from 'hooks';
import './index.scss';

function SignIn() {
  const { search } = useLocation();
  const { method, redirect } = uurl.useSearch();

  useLoaded();

  useEffect(() => {
    if (method) {
      if (user.authMethods.includes(method)) {
        user.signIn({ method, redirectURL: redirect });
      } else {
        prompt.error('Invalid sign in method.');
      }
    }
  }, [search]);

  const signInOptions = [
    {
      name: 'University Credential Sign In',
      description: 'Sign in with your university authentication system.',
      method: user.method.CILOGON,
      icon: 'school'
    },
    {
      name: 'Email Sign In',
      description: 'Sign in or sign up with your emails address.',
      method: user.method.AUTH0,
      icon: 'email'
    }
  ];

  if (env.dev) {
    signInOptions.push({
      name: 'Test Sign In',
      description: 'Sign in as an administrator (Dev server only).',
      method: user.method.TEST,
      icon: 'admin_panel_settings'
    });
  }

  return (
    <CTFragment role="main" center className="h-100">
      <CTFragment className="ct-signin-card">
        <CTFragment padding={[0,20,30,20]} vEnd>
          <CTBrand size="large" />
          <CTText as="h1" muted uppercase size="big" margin={[0,0,0,10]}>
            Sign In
          </CTText>
        </CTFragment>

        <CTText muted margin={[0,0,10,25]} as="h3">
          Choose a sign-in or sign-up method
        </CTText>

        <CTFragment role="list" list className="ct-signin-opts">
          {signInOptions.map(opt => (
            <CTFragment 
              vCenter
              as={Link}
              to={uurl.createSearch({ method: opt.method, redirect })}
              role="listitem"
              className="ct-signin-opt"
              key={opt.method}
            >
              <span className="material-icons">{opt.icon}</span>
              <CTFragment list className="opt-text">
                <CTText bold size="medium" padding={[0,0,5,0]} className="opt-name">
                  {opt.name}
                </CTText>
                <CTText>{opt.description}</CTText>
              </CTFragment>
            </CTFragment>
          ))}
        </CTFragment>
      </CTFragment>
    </CTFragment>
  );
}

export default SignIn;
