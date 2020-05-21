import React from 'react';

export default function Placeholder({ small = false }) {
  return small ? (
    <div className="w-100 d-flex justify-content-center align-items-center px-3">
      <div className="sk-bounce" small="true" bright="true">
        <div className="sk-bounce-dot" />
        <div className="sk-bounce-dot" />
      </div>
      <div className="sk-bounce mx-1" small="true" bright="true">
        <div className="sk-bounce-dot" />
        <div className="sk-bounce-dot" />
      </div>
      <div className="sk-bounce" small="true" bright="true">
        <div className="sk-bounce-dot" />
        <div className="sk-bounce-dot" />
      </div>
    </div>
  ) : (
    <div className="w-100 d-flex justify-content-center align-items-center p-5">
      <div className="sk-flow">
        <div className="sk-flow-dot" />
        <div className="sk-flow-dot" />
        <div className="sk-flow-dot" />
      </div>
    </div>
  );
}
