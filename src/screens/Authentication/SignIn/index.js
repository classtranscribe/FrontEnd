import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import { env, uurl, user, prompt } from 'utils';
import { CTFragment, CTBrand, CTText, CTList } from 'layout';
import { useLoaded } from 'hooks';
import './index.scss';

function SignIn(props) {
  const { search } = props.location;
  const { method, redirect, aspopup } = uurl.useSearch();

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

  const handleSignIn = (_method) => () => {
    if (window.location.search.includes(encodeURIComponent(redirect))) {
      user.signIn({
        method: _method,
        redirectURL: redirect,
        closeAfterSignedIn: aspopup === 'true',
      });
    } else {
      window.location = redirect;
    }
  };

  const signInOptions = [
    {
      title: 'University Credential Sign In',
      description: 'Sign in with your university authentication system.',
      id: user.method.CILOGON,
      icon: 'school',
    },
    {
      title: 'Email Sign In',
      description: 'Sign in or sign up with your emails address.',
      id: user.method.AUTH0,
      icon: 'email',
    },
  ];

  if (env.dev) {
    signInOptions.push({
      title: 'Test Sign In',
      description: 'Sign in as an administrator (Dev server only).',
      id: user.method.TEST,
      icon: 'admin_panel_settings',
    });
  }

  const listitems = signInOptions.map((opt) => ({ ...opt, onClick: handleSignIn(opt.id) }));

  return (
    <CTFragment fadeIn role="main" center className="h-100" id="ct-signin-main">
      <CTFragment className="ct-signin-card shadow">
        <CTFragment padding={[0, 20, 30, 20]} alignItEnd>
          <CTBrand size="large" />
          <CTText as="h1" muted uppercase size="big" margin={[0, 0, 0, 10]}>
            Sign In
          </CTText>
        </CTFragment>

        <CTText muted margin={[0, 0, 10, 25]} size="medium" as="h3">
          Choose a sign-in or sign-up method
        </CTText>

        <CTList items={listitems} />
      </CTFragment>
    </CTFragment>
  );
}

export default withRouter(SignIn);
