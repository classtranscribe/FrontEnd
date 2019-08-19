import React, { useEffect } from 'react'
import { api } from 'utils'

export function NotFound404({ history }) {
  useEffect(() => {
    api.contentLoaded(100)
  }, [history])
  
  return (
    <div>404</div>
  )
}
