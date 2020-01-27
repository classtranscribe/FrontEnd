import React from 'react'
import { connectWithRedux } from '_redux/instructor'
import './index.css'

function LoaderWithRedux({
  loading={}
}) {
  return (
    <div className="ip-loader-con">
      <div className="sk-wave">
        <div className="sk-wave-rect"></div>
        <div className="sk-wave-rect"></div>
        <div className="sk-wave-rect"></div>
        <div className="sk-wave-rect"></div>
        <div className="sk-wave-rect"></div>
      </div>

      <div className="ip-l-title">
        {loading.title}
      </div>
    </div>
  )
}

export const Loader = connectWithRedux(
  LoaderWithRedux,
  ['loading'],
  []
)