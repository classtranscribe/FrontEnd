import React, { useEffect } from 'react'
import { api } from '../../utils'
import './index.css'

export function Maintenance({ }) {
  useEffect(() => {
    api.contentLoaded()
  })
  return (
    <body>
      <div class="holder">
        <div class="logo">
          <h1>CLASSTRANSCRIBE</h1>
          <h5>ClassTranscribe is down for maintenance till 8pm today</h5>
        </div>
      </div>
    </body>
  )
}