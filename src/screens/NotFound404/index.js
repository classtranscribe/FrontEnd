import React, { useEffect } from 'react';
import { CTErrorWrapper } from 'layout';
import { api } from 'utils';

export function NotFound404() {
  useEffect(() => {
    api.contentLoaded(100);
  }, []);

  return <CTErrorWrapper navbar show goHomeButton />;
}
