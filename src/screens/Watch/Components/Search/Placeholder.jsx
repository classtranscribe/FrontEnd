import React from 'react';

export default function Placeholder({ small = false }) {
  return small ? (
    <div className="w-100 d-flex justify-content-center align-items-center px-3" aria-busy aria-label="Content not yet available">
      <div className="sk-bounce" role="presentation">
        <div className="sk-bounce-dot" />
        <div className="sk-bounce-dot" />
      </div>
      <div className="sk-bounce mx-1" role="presentation">
        <div className="sk-bounce-dot" />
        <div className="sk-bounce-dot" />
      </div>
      <div className="sk-bounce" role="presentation">
        <div className="sk-bounce-dot" />
        <div className="sk-bounce-dot" />
      </div>
    </div>
  ) : (
    <div className="w-100 d-flex justify-content-center align-items-center p-5" aria-busy aria-label="Content not yet available">
      <div className="sk-flow" role="presentation">
        <div className="sk-flow-dot" />
        <div className="sk-flow-dot" />
        <div className="sk-flow-dot" />
      </div>
    </div>
  );
}
