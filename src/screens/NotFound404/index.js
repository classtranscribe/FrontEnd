import React, { useEffect } from 'react'
import { useCTContext } from '../../components'
import { api } from '../../utils'

export function NotFound404({ history }) {
  const { ErrorMesg } = useCTContext()
  useEffect(() => {
    api.contentLoaded(100)
  }, [history])
  
  return (
    //<div>404</div>
    <ErrorMesg mesg={{info: 'The requested URL is not found'}} notFound404 />
  )
}
