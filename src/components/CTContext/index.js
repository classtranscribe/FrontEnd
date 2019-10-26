import React, { createContext, useContext, useState } from 'react'
import { api } from '../../utils'
import GeneralAlert from './Components/GeneralAlert'
import ErrorMesg from './Components/ErrorMesg'

export const CTContext = createContext()
export const useCTContext = () => useContext(CTContext)

export function CTContextProvider({ children }) {
  const [alertMesg, setAlertMesg] = useState(null) // {header: '', text: '', type: 'success', position: 'bottom'}
  const [errorMesg, setErrorMesg] = useState(null)

  const windowAlert = mesg => alert(mesg)

  /** General Alerts */
  const alreadyHasAlert = () => Boolean(alertMesg)
  const generalAlert = (mesg = {header: '', text: '', type: 'success', position: 'bottom'}, span = 4000) => {
    setAlertMesg(mesg)
    if (span > 0) setTimeout(() => {
      setAlertMesg(null)
    }, span);
  }
  const removeAlert = () => setAlertMesg(null)

  const generalError = ({ text='', header='', refresh=true, span=-1 }) => {
    api.contentLoaded()
    generalAlert({ 
      header, refresh,
      text: text + (refresh ? " Please refresh to retry." : ""),
      type: "danger",
      position: "top",
    }, span)
  }

  const hasError = (mesg = { header: '', info: '', error: {}}) => setErrorMesg(mesg)


  return (
    <CTContext.Provider
      value={{ 
        windowAlert,
        
        alreadyHasAlert,
        generalAlert,
        generalError,
        removeAlert,

        ErrorMesg,
        hasError,
      }}
    >
      <>
        <GeneralAlert mesg={alertMesg} onClose={() => setAlertMesg(null)} />
        <ErrorMesg mesg={errorMesg} />
        {children}
      </>
    </CTContext.Provider>
  )
}