import React, { useEffect } from 'react';
import { CTErrorWrapper } from 'layout';
import { api, links } from 'utils';

export function NotFound404() {
  useEffect(() => {
    api.contentLoaded(100);
    links.title('404');
  }, []);

  return (
    <CTErrorWrapper 
      navbar 
      show
      goHomeButton
      retry={false}
      redirectUri={links.home()} 
    />
  );
}
