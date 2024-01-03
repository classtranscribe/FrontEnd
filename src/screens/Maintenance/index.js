import React, { useEffect } from 'react';
import { api,env } from 'utils';
import './index.css';

export function Maintenance() {
  useEffect(() => {
    api.contentLoaded();
  });
  const message = env.classTranscribeDownMessage;
  return (
    <body>
      <div className="holder">
        <div className="logo">
          <h1>ClassTranscribe</h1>
          <h2>{message}</h2>
        </div>
      </div>
    </body>
  );
}
